const functions = require("firebase-functions");

// https://github.com/firebase/functions-cron
exports.hourly_job = functions.pubsub.topic("hourly-tick").onPublish(event => {
  console.log("This job is ran every hour!");
});
