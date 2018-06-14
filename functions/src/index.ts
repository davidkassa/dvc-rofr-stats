import { URL } from "url";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as request from "request-promise-native";
import * as cheerio from "cheerio";
import * as moment from "moment";

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
    let meta = await getMetadata();
    console.log(`meta: ` + JSON.stringify(meta));
    let hash = new URL(meta.url).hash;
    let $ = await getRawHtml(meta.url);
    let epoch = parseEditDateFromHtml(hash, $);

    if (meta.epoch !== epoch) {
      let contracts = parseContractsFromHtml(hash, $);
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
  let snapshot = await firestore.collection("meta").get();
  return snapshot.docs[0].data(); // only 1 record
}

async function getRawHtml(url) {
  const fs = require("fs");
  const util = require("util");
  // Convert fs.readFile into Promise version of same
  const readFile = util.promisify(fs.readFile);
  let file = await readFile("../data/4.2018-raw.html", {
    encoding: "utf8"
  });
  return cheerio.load(file);

  // let options = {
  //   uri: url,
  //   transform: function(body) {
  //     return cheerio.load(body);
  //   }
  // };

  // return await request(options);
}

function parseEditDateFromHtml(hash, $) {
  // https://www.disboa......#post-59034110
  // id=post-59034110
  // div class=editDate class=DateTime data-time data-diff, epoch

  return $(hash + " .editDate .DateTime").attr("data-time"); //"epoch";
}

function parseContractsFromHtml(hash, $) {
  // https://www.disboa......#post-59034110
  // id=post-59034110
  // div class=messageContent

  let html = $(hash + " div.messageContent").html();
  let lines = html.split("<br>").map(l =>
    cheerio
      .load(l)
      .root()
      .text()
  );
  let contracts = lines
    .filter(l => l.indexOf("---") >= 0)
    .map(parseLine)
    .filter(l => l !== null);

  return contracts;
}

function parseLine(line) {
  // NewbieMom---$88-$14839-150-AKV-Apr-0/17, 150/18, 150/19, 150/20- sent 5/7
  // David K.---$102-$22356-200-AKV-Sep-0/17, 200/18, 200/19- sent 4/12, taken 5/8
  // David K.---$104-$24537-220-AKV-Mar-0/17, 152/18, 220/19-International seller- sent 5/14, passed 5/31

  let contract = new Contract();
  let a = line.split("---");
  if (a.length !== 2) {
    //error state
    console.error("Error: " + line);
    return null;
  }
  contract.user = a[0];
  let props = a[1].split("-");
  if (props.length < 7 || props.length > 8) {
    //error state
    console.error("Error: " + line);
    return null;
  }
  contract.pricePerPoint = Number(props[0].substr(1)); //strip $
  contract.totalCost = Number(props[1].substr(1)); //strip $
  contract.points = Number(props[2]);
  contract.resort = props[3];
  contract.useYear = props[4];
  contract.availablePoints = props[5];
  contract.notes = props.length === 8 ? props[6] : null;
  let dateStr = props.length === 8 ? props[7] : props[6];
  let dates = dateStr.split(",");
  let dateSentStr = dates[0].replace("sent").trim();
  contract.dateSent = moment(dateSentStr, "MM/DD").format("YYYY-MM-DD");
  let status = "Waiting";
  let dateResolved = null;
  if (dates.length === 2) {
    status = dates[1].indexOf("taken") >= 0 ? "Taken" : "Passed";
    let dateResolvedStr = dates[1]
      .replace("taken")
      .replace("passed")
      .trim();
    dateResolved = moment(dateResolvedStr, "MM/DD").format("YYYY-MM-DD");
  }
  contract.status = status;
  contract.dateResolved = dateResolved;
  contract.hash = getContractHash(contract);

  return contract;
}

function getContractHash(contract) {
  // // hash based on properties that shouldn't be changed
  // contract.availablePoints
  // // contract.dateResolved
  // contract.dateSent
  // // contract.notes
  // contract.points
  // contract.pricePerPoint
  // contract.resort
  // contract.status
  // // contract.totalCost
  // contract.useYear
  // contract.user
  return "hash";
}

async function saveContractsToFirebase(epoch, contracts) {
  console.log("epoch: " + epoch + "\ncontracts: " + contracts.length);
  await firestore
    .collection("contracts")
    .doc("8888888")
    .set({ id: "9999999", test: true }, { merge: true });

  // could stash ID from initial lookup
  let metaSnapshot = await firestore.collection("meta").get();
  let metaId = metaSnapshot.docs[0].id;
  await firestore
    .collection("meta")
    .doc(metaId)
    .update({
      epoch: epoch + "xxx"
    });
  return true;
}

if (process.env.NODE_ENV === "test") {
  exports.processDisBoardsData = processDisBoardsData;
  exports.parseEditDateFromHtml = parseEditDateFromHtml;
  exports.parseContractsFromHtml = parseContractsFromHtml;
  exports.parseLine = parseLine;
}
