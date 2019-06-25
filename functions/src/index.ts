import * as cheerio from "cheerio";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as moment from "moment";
import * as request from "request-promise-native";
import { URL } from "url";

import { Contract } from "./contract";
import { Meta } from "./meta";

// https://github.com/firebase/functions-samples/blob/master/presence-firestore/functions/index.js
admin.initializeApp();

// Since this code will be running in the Cloud Functions environment
// we call initialize Firestore without any arguments because it
// detects authentication from the environment.
const firestore = admin.firestore();

// from running `firebase functions:shell --debug`
// Ignoring trigger "hourly_job" because the service "pubsub.googleapis.com" is not yet supported.
if (process.env.NODE_ENV === "TEMP_pubsub") {
  exports.testFunction = functions.https.onRequest(() => {
    return processDisBoardsData();
  });
}

// https://firebase.google.com/docs/functions/schedule-functions
// https://console.cloud.google.com/cloudscheduler
exports.hourly_job = functions.pubsub
  .schedule("every 1 hours")
  .onRun(async context => {
    return processDisBoardsData();
  });

// can't get to work with raw-loader
// import htmlData from "@/../data/4.2018-raw.html";

async function processDisBoardsData() {
  console.log("Processing DisBoard Data!");

  try {
    const changeData: Array<{ meta: Meta; contracts: Contract[] }> = [];
    const meta = await getMetadata();
    for (const data of meta) {
      const url = new URL(data.url);
      const hash = url.hash; // includes #
      const id = hash.substring(1);
      // const id = url.pathname.substring(url.pathname.lastIndexOf("/") + 1);
      const parentSelector = "article[data-content=" + id + "]";
      const childDateSelector = "time";
      const childContentSelector = ".bbWrapper";

      const $ = await getRawHtml(data.url);
      const epoch = parseEditDateFromHtml(parentSelector, childDateSelector, $);

      if (data.epoch !== epoch) {
        data.epoch = epoch;
        const contracts = parseContractsFromHtml(
          parentSelector,
          childContentSelector,
          $,
          data.maxDate
        );
        console.log(
          "parsed epoch: " + epoch + " contracts: " + contracts.length
        );
        contracts.forEach(c => (c.metaId = data.id));
        changeData.push({ meta: data, contracts });
      }
    }
    if (changeData.length > 0) {
      return await saveChangeDataToFirebase(changeData);
    }

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function getMetadata(): Promise<Meta[]> {
  // return {
  //   url:
  //     "https://www.disboards.com/threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/#post-59034110",
  //   epoch: "1527551590"
  // };
  const snapshot = await firestore.collection("meta").get();
  // Object.keys(s.val() || {}) .map(k => s.val()[k]);
  const meta: Meta[] = [];
  for (const doc of snapshot.docs) {
    const data = doc.data();
    const m = new Meta();
    m.id = doc.id;
    m.active = data.active;
    m.epoch = data.epoch;
    m.text = data.text;
    m.url = data.url;
    m.maxDate = moment(data.maxDate, "YYYY-MM-DD");
    meta.push(m);
  }
  return meta; // snapshot.docs[0].data(); // only 1 record
}

async function getRawHtml(url) {
  // const fs = require("fs");
  // const util = require("util");
  // // Convert fs.readFile into Promise version of same
  // const readFile = util.promisify(fs.readFile);
  // const file = await readFile("../data/4.2018-raw.html", {
  //   encoding: "utf8"
  // });
  // return cheerio.load(file);

  const options = {
    uri: url,
    transform(body) {
      return cheerio.load(body);
    }
  };

  return request(options);
}

function parseEditDateFromHtml(parentSelector, childSelector, $) {
  // https://www.disboa......#post-59034110
  // id=post-59034110
  // div class=editDate class=DateTime data-time data-diff, epoch

  // timeNode = $(hash + " .messageMeta .DateTime");
  // let timeNode = $(hash + " .editDate .DateTime");
  const timeNode = $(parentSelector + " " + childSelector);
  let epoch = timeNode.attr("data-time"); // "epoch";
  if (!epoch) {
    const editStr = timeNode.attr("title"); // format: Apr 3, 2018 at 1:51 PM
    if (editStr) {
      epoch = moment(editStr, "MMM D, YYYY at h:mm A")
        .unix()
        .toString();
    }
  }

  return epoch;
}

function parseContractsFromHtml(
  parentSelector,
  childSelector,
  $,
  maxDate
): Contract[] {
  // https://www.disboa......#post-59034110
  // id=post-59034110
  // div class=messageContent
  // " .bbWrapper"

  const html: string = $(parentSelector + " " + childSelector).html();

  const lines = html.split("<br>").map(l =>
    cheerio
      .load(l)
      .root()
      .text()
  );
  const contracts = lines
    .filter(l => l.indexOf("---") >= 0)
    .map(l => parseLine(l, maxDate))
    .filter(l => l !== null);

  return contracts;
}

function parseLine(line: string, maxDate: moment.Moment): Contract {
  // NewbieMom---$88-$14839-150-AKV-Apr-0/17, 150/18, 150/19, 150/20- sent 5/7
  // David K.---$102-$22356-200-AKV-Sep-0/17, 200/18, 200/19- sent 4/12, taken 5/8
  // David K.---$104-$24537-220-AKV-Mar-0/17, 152/18, 220/19-International seller- sent 5/14, passed 5/31

  const contract = new Contract();
  const a = line.split("---");
  if (a.length !== 2) {
    // error state
    console.error("Error: " + line);
    return null;
  }
  contract.user = a[0];
  const props = a[1].split("-");
  if (props.length < 7 || props.length > 8) {
    // error state
    console.error("Error: " + line);
    return null;
  }
  contract.pricePerPoint = Number(props[0].substr(1)); // strip $
  contract.totalCost = Number(props[1].substr(1)); // strip $
  contract.points = Number(props[2]);
  contract.resort = props[3];
  contract.useYear = props[4];
  contract.availablePoints = props[5];
  contract.notes = props.length === 8 ? props[6] : null;
  const dateStr = props.length === 8 ? props[7] : props[6];
  const dates = dateStr.split(",");
  const dateSentStr = dates[0].replace("sent", "").trim();
  let momentSent = moment(dateSentStr, "MM/DD");
  while (momentSent > maxDate) {
    momentSent = momentSent.subtract(1, "year");
  }
  contract.dateSent = momentSent.format("YYYY-MM-DD");
  let status = "Waiting";
  let dateResolved = null;
  if (dates.length === 2) {
    status = dates[1].indexOf("taken") >= 0 ? "Taken" : "Passed";
    const dateResolvedStr = dates[1]
      .replace("taken", "")
      .replace("passed", "")
      .trim();
    let momentResolved = moment(dateResolvedStr, "MM/DD");
    while (momentResolved > maxDate) {
      momentResolved = momentResolved.subtract(1, "year");
    }
    dateResolved = momentResolved.format("YYYY-MM-DD");
  }
  contract.status = status;
  contract.dateResolved = dateResolved;

  return contract;
}

async function saveChangeDataToFirebase(data) {
  let result = true;
  // wanna try to run and save all of these
  for (const d of data) {
    const contractResult = await saveContractsToFirebase(d);
    let metaResult = false;
    if (contractResult) {
      metaResult = await saveMetaToFirebase(d.meta);
    }
    result = contractResult && metaResult && result;
  }
  return result;
}

async function saveContractsToFirebase(data) {
  console.log("saving contracts: " + data.contracts.length);
  // get contracts from DB, wrap with found bool
  try {
    const contractSnapshot = await firestore
      .collection("contracts")
      .where("metaId", "==", data.meta.id)
      .get();
    const dbContracts: any = contractSnapshot.docs.map(d => ({
      found: false,
      id: d.id,
      ...d.data()
    }));
    // iterate through new contracts: add/update
    for (const c of data.contracts) {
      const dbContract = dbContracts.find(d => d.id === c.checksum);
      if (dbContract) {
        dbContract.found = true;
      }

      await firestore
        .collection("contracts")
        .doc(c.checksum)
        .set({ ...c }, { merge: true });
    }
    // delete any originals with found=false bool
    for (const d of dbContracts.filter(f => f.found === false)) {
      await firestore
        .collection("contracts")
        .doc(d.id)
        .delete();
    }
  } catch (err) {
    console.error(err);
    return false;
  }
  return true;
}
async function saveMetaToFirebase(meta: Meta) {
  console.log("saving meta: " + meta.id);

  await firestore
    .collection("meta")
    .doc(meta.id)
    .set({ epoch: meta.epoch }, { merge: true });

  return true;
}

if (process.env.NODE_ENV === "test") {
  exports.processDisBoardsData = processDisBoardsData;
  exports.parseEditDateFromHtml = parseEditDateFromHtml;
  exports.parseContractsFromHtml = parseContractsFromHtml;
  exports.parseLine = parseLine;
}
