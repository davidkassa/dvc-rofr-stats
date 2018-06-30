import * as cheerio from "cheerio";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as moment from "moment";
import * as request from "request-promise-native";
import { URL } from "url";

import { Contract } from "./contract";

// https://github.com/firebase/functions-samples/blob/master/presence-firestore/functions/index.js
admin.initializeApp();

// Since this code will be running in the Cloud Functions enviornment
// we call initialize Firestore without any arguments because it
// detects authentication from the environment.
const firestore = admin.firestore();

// https://github.com/firebase/functions-cron
exports.hourly_job = functions.pubsub.topic("hourly-tick").onPublish(event => {
  return processDisBoardsData();
});

// can't get to work with raw-loader
// import htmlData from "@/../data/4.2018-raw.html";

async function processDisBoardsData() {
  console.log("Processing DisBoard Data!");

  try {
    const meta = await getMetadata();
    const hash = new URL(meta.url).hash;
    const $ = await getRawHtml(meta.url);
    const epoch = parseEditDateFromHtml(hash, $);

    if (meta.epoch !== epoch) {
      const contracts = parseContractsFromHtml(hash, $);
      return saveContractsToFirebase(epoch, contracts);
    }

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function getMetadata() {
  // return {
  //   url:
  //     "https://www.disboards.com/threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/#post-59034110",
  //   epoch: "1527551590"
  // };
  const snapshot = await firestore.collection("meta").get();
  return snapshot.docs[0].data(); // only 1 record
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

function parseEditDateFromHtml(hash, $) {
  // https://www.disboa......#post-59034110
  // id=post-59034110
  // div class=editDate class=DateTime data-time data-diff, epoch

  const timeNode = $(hash + " .editDate .DateTime");
  let epoch = timeNode.attr("data-time"); // "epoch";
  if (!epoch) {
    const dateStr = timeNode.attr("title"); // format: Apr 3, 2018 at 1:51 PM
    if (dateStr) {
      epoch = moment(dateStr, "MMM D, YYYY at h:mm A")
        .unix()
        .toString();
      console.log(`edit date str ${epoch}`);
    }
  }
  if (!epoch) {
    const dateStr = $(hash + " .messageMeta .DateTime").attr("title"); // format: Apr 3, 2018 at 1:51 PM
    epoch = moment(dateStr, "MMM D, YYYY at h:mm A")
      .unix()
      .toString();
    console.log(`date str ${epoch}`);
  }
  return epoch;
}

function parseContractsFromHtml(hash, $) {
  // https://www.disboa......#post-59034110
  // id=post-59034110
  // div class=messageContent

  const html = $(hash + " div.messageContent").html();
  const lines = html.split("<br>").map(l =>
    cheerio
      .load(l)
      .root()
      .text()
  );
  const contracts = lines
    .filter(l => l.indexOf("---") >= 0)
    .map(parseLine)
    .filter(l => l !== null);

  return contracts;
}

function parseLine(line) {
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
  const dateSentStr = dates[0].replace("sent").trim();
  contract.dateSent = moment(dateSentStr, "MM/DD").format("YYYY-MM-DD");
  let status = "Waiting";
  let dateResolved = null;
  if (dates.length === 2) {
    status = dates[1].indexOf("taken") >= 0 ? "Taken" : "Passed";
    const dateResolvedStr = dates[1]
      .replace("taken")
      .replace("passed")
      .trim();
    dateResolved = moment(dateResolvedStr, "MM/DD").format("YYYY-MM-DD");
  }
  contract.status = status;
  contract.dateResolved = dateResolved;

  return contract;
}

async function saveContractsToFirebase(epoch: string, contracts: Contract[]) {
  console.log("saving epoch: " + epoch + " contracts: " + contracts.length);

  // get contracts from DB, wrap with found bool
  const contractSnapshot = await firestore.collection("contracts").get();
  const dbContracts = contractSnapshot.docs.map(d => ({
    found: false,
    id: d.id,
    ...d.data()
  }));
  // iterate through new contracts: add/update
  for (const c of contracts) {
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

  // get snapshot, update ref
  // could stash ID from initial lookup
  const metaSnapshot = await firestore.collection("meta").get();
  const metaId = metaSnapshot.docs[0].id;
  await firestore
    .collection("meta")
    .doc(metaId)
    .set({ epoch }, { merge: true });
  return true;
}

if (process.env.NODE_ENV === "test") {
  exports.processDisBoardsData = processDisBoardsData;
  exports.parseEditDateFromHtml = parseEditDateFromHtml;
  exports.parseContractsFromHtml = parseContractsFromHtml;
  exports.parseLine = parseLine;
}
