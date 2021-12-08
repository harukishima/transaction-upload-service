const express = require('express');
const router = express.Router();

const Transaction = require('../models/transaction');
const {Op, where} = require("sequelize");

router.get('/', async function(req, res, next) {
  const {currency, date_start, date_end, status} = req.query;

  const whereCause = {};
  if (currency) {
    whereCause.currency_code = currency;
  }
  if (date_start) {
    whereCause.transaction_date = {
      [Op.gte]: date_start
    }
  }
  if (date_end) {
    whereCause.transaction_date = {
      [Op.lte]: date_end
    }
  }
  if (status) {
    whereCause.status = status;
  }

  const tr = await Transaction.findAll({
    where: whereCause,
  });
  res.json(tr);
});

module.exports = router;
