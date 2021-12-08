const Transaction = require('../models/transaction');
const moment = require('moment');

module.exports = {
  saveAll: (arr) => {
    return Transaction.bulkCreate(arr);

  },
}