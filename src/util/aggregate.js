import moment from "moment";

// define a mixin object
export default {
  methods: {
    getAverageWaitTime: function (contracts) {
      // console.log(contracts);
      var contractCount = contracts.length;
      var sum = contracts.reduce(function (prevVal, elem) {
        let resolved = moment(elem.dateResolved, moment.HTML5_FMT.DATE);
        if (!resolved.isValid()) {
          resolved = moment();
        }
        let sent = moment(elem.dateSent, moment.HTML5_FMT.DATE);
        let waiting = resolved.diff(sent, "days");
        if (!sent.isValid() || isNaN(waiting)) {
          waiting = 0;
          contractCount--;
        }
        // console.log(`resolved: ${resolved} sent: ${sent} waiting: ${waiting} `);

        return prevVal + waiting;
      }, 0);
      var avg = sum / contractCount;
      if (isNaN(avg)) {
        return "---";
      }
      return avg.toFixed(2) + " days";
    },
    getAveragePoints: function (contracts) {
      return this.getAverage(contracts, "points");
    },
    getAveragePricePerPoint: function (contracts) {
      return this.asCurrencyFormat(this.getAverage(contracts, "pricePerPoint"));
    },
    getAverageTotalCost: function (contracts) {
      return this.asCurrencyFormat(this.getAverage(contracts, "totalCost"));
    },
    getAverage: function (contracts, prop) {
      // console.log(contracts);
      var contractCount = contracts.length;
      var sum = contracts.reduce(function (prevVal, elem) {
        var val = elem[prop];
        if (isNaN(val)) {
          val = 0;
          contractCount--;
        }
        return prevVal + val;
      }, 0);
      var avg = sum / contractCount;
      return avg.toFixed(2);
    },
    asCurrencyFormat: function (num) {
      return "$" + parseFloat(num).toLocaleString("en");
    },
  },
};
