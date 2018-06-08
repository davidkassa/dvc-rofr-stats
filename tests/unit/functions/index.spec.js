import fbFuncTest from "firebase-functions-test";
import functions from "../../../functions/index";

const test = fbFuncTest();
//const functions = require("./index.js");

const hourly_job = test.wrap(functions.hourly_job);
const data = test.pubsub.exampleMessage(); // don't really care about data because it's cron

describe("index.js", () => {
  it("returns true from hourly_job", () => {});
  //   const snapshot = test.firestore.makeDocumentSnapshot(
  //     {
  //       foo: "bar"
  //     },
  //     "document/path"
  //   );

  expect(hourly_job(data)).toBe(true);
});
