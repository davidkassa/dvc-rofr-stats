const test = require('firebase-functions-test')();
const functions = require('./index.js');

const hourly_job = test.wrap(myFunctions.hourly_job);
const data = test.pubsub.exampleMessage(); // don't really care about data because it's cron

function test() {
    const snapshot = test.firestore.makeDocumentSnapshot({foo: 'bar'}, 'document/path');
    hourly_job(data);
}