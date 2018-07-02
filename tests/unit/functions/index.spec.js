import * as functions from "../../../functions/lib/index";

import moment from "moment";

const fs = require("fs");
const cheerio = require("cheerio");

// import fbFuncTest from "firebase-functions-test";
// const test = fbFuncTest();

// const hourly_job = test.wrap(functions.hourly_job);
// const data = test.pubsub.exampleMessage(); // don't really care about data because it's cron

// describe("index.js", () => {
//   it("returns true from hourly_job", () => {});
//   //   const snapshot = test.firestore.makeDocumentSnapshot(
//   //     {
//   //       foo: "bar"
//   //     },
//   //     "document/path"
//   //   );

//   // expect(hourly_job(data)).toBe(true);
// });

// describe("processDisBoardsData", () => {
//   it("works", async () => {
//     await expect(functions.processDisBoardsData()).resolves.toBe(true);
//   });
// });

describe("parseEditDateFromHtml", () => {
  it("finds the correct epoch", () => {
    var htmlData = fs.readFileSync("tests/unit/functions/raw.html", {
      encoding: "utf8"
    });
    var result = functions.parseEditDateFromHtml(
      "#post-59034110",
      cheerio.load(htmlData)
    );
    expect(result).toBe("1528564129");
  });
});

describe("parseEditDateFromHtml", () => {
  it("finds the correct edit date string", () => {
    var htmlData = fs.readFileSync(
      "tests/unit/functions/raw.editdatestring.html",
      {
        encoding: "utf8"
      }
    );
    var result = functions.parseEditDateFromHtml(
      "#post-59034110",
      cheerio.load(htmlData)
    );
    //Jun 5, 2018 at 2:51 PM
    expect(result).toBe(
      moment([2018, 5, 5, 14, 51, 0, 0]) // zero-based month
        .unix()
        .toString()
    );
  });
});

describe("parseEditDateFromHtml", () => {
  it("finds the correct date string", () => {
    var htmlData = fs.readFileSync("tests/unit/functions/raw.datestring.html", {
      encoding: "utf8"
    });
    var result = functions.parseEditDateFromHtml(
      "#post-59034110",
      cheerio.load(htmlData)
    );
    //Apr 3, 2018 at 12:51 PM
    expect(result).toBe(
      moment([2018, 3, 23, 12, 51, 0, 0])
        .unix()
        .toString()
    );
  });
});

describe("parseContractsFromHtml", () => {
  it("finds the correct number of contracts", () => {
    var htmlData = fs.readFileSync("tests/unit/functions/raw.html", {
      encoding: "utf8"
    });
    var result = functions.parseContractsFromHtml(
      "#post-59034110",
      cheerio.load(htmlData)
    );
    expect(result.length).toBe(164);
  });
});

describe("parseLine", () => {
  it("parses a waiting contract", () => {
    let input =
      "NewbieMom---$88-$14839-150-AKV-Apr-0/17, 150/18, 150/19, 150/20- sent 5/7";
    let output = functions.parseLine(input);

    expect(output.availablePoints).toBe("0/17, 150/18, 150/19, 150/20");
    expect(output.dateResolved).toBe(null);
    expect(output.dateSent).toBe("2018-05-07");
    expect(output.notes).toBe(null);
    expect(output.points).toBe(150);
    expect(output.pricePerPoint).toBe(88);
    expect(output.resort).toBe("AKV");
    expect(output.status).toBe("Waiting");
    expect(output.totalCost).toBe(14839);
    expect(output.useYear).toBe("Apr");
    expect(output.user).toBe("NewbieMom");
  });
  it("parses a taken contract", () => {
    let input =
      "David K.---$102-$22356-200-AKV-Sep-0/17, 200/18, 200/19- sent 4/12, taken 5/8";
    let output = functions.parseLine(input);

    expect(output.availablePoints).toBe("0/17, 200/18, 200/19");
    expect(output.dateResolved).toBe("2018-05-08");
    expect(output.dateSent).toBe("2018-04-12");
    expect(output.notes).toBe(null);
    expect(output.points).toBe(200);
    expect(output.pricePerPoint).toBe(102);
    expect(output.resort).toBe("AKV");
    expect(output.status).toBe("Taken");
    expect(output.totalCost).toBe(22356);
    expect(output.useYear).toBe("Sep");
    expect(output.user).toBe("David K.");
  });
  it("parses a passed contract with comment", () => {
    let input =
      "David K.---$104-$24537-220-AKV-Mar-0/17, 152/18, 220/19-International seller- sent 5/14, passed 5/31";
    let output = functions.parseLine(input);

    expect(output.availablePoints).toBe("0/17, 152/18, 220/19");
    expect(output.dateResolved).toBe("2018-05-31");
    expect(output.dateSent).toBe("2018-05-14");
    expect(output.notes).toBe("International seller");
    expect(output.points).toBe(220);
    expect(output.pricePerPoint).toBe(104);
    expect(output.resort).toBe("AKV");
    expect(output.status).toBe("Passed");
    expect(output.totalCost).toBe(24537);
    expect(output.useYear).toBe("Mar");
    expect(output.user).toBe("David K.");
  });
  it("parses a name with a -", () => {
    let input =
      "David-K.---$104-$24537-220-AKV-Mar-0/17, 152/18, 220/19-International seller- sent 5/14, passed 5/31";
    let output = functions.parseLine(input);

    expect(output.user).toBe("David-K.");
  });
});
