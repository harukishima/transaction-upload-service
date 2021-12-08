const express = require('express');
const router = express.Router();

const multer = require('multer');
const upload = multer({dest: 'uploads/'});

const fs = require('fs');
const csv = require('csv-parser');

const {XMLParser} = require('fast-xml-parser');

const util = require('../utils/transaction');
const moment = require("moment");

router.post('/csv', upload.single('file'), function (req, res, next) {
  if (!req.file) {
    res.status(400).send('No file uploaded.');
    return;
  }
  const results = [];
  const log = [];
  fs.createReadStream(req.file.path)
    .pipe(csv(['transaction_id', 'amount', 'currency_code', 'transaction_date', 'status']))
    .on('data', (row) => {
      if (!row.transaction_id || !row.amount || !row.currency_code || !row.transaction_date || !row.status) {
        log.push(row);
      } else {
        results.push(row);
      }
    })
    .on('error', (err) => {
      res.status(500).json({
        error: err,
        log: log,
      });
    })
    .on('end', async () => {
      if (log.length > 0) {
        res.status(400).json({
          message: 'Invalid CSV file',
          log: log
        });
      } else {
        const newArr = results.map((item) => {
          let status = '';
          if (item.status === 'Approved') {
            status = 'A';
          } else if (item.status === 'Failed' || item.status === 'Rejected') {
            status = 'R';
          } else {
            status = 'D';
          }
          return {
            ...item,
            status,
            amount: Number.parseFloat(item.amount.replace(/,/g, '')),
            transaction_date: moment(item.transaction_date, 'DD/MM/YYYY HH:mm:ss').toDate()
          };
        });
        try {
          await util.saveAll(newArr);
          res.status(200).json({
            message: 'CSV file uploaded successfully',
            results: newArr
          });
        } catch (err) {
          res.status(500).json({
            error: err,
            log: log,
          });
        }
      }
    });
});

router.post('/xml', upload.single('file'), async (req, res, next) => {
  if (!req.file) {
    res.status(400).send('No file uploaded.');
    return;
  }
  const file = fs.readFileSync(req.file.path);
  const parser = new XMLParser({ignoreAttributes: false});
  const log = [];
  let json = parser.parse(file);
  let newArr = json.Transactions?.Transaction?.map((item) => {
    let status = '';
    if (item.Status === 'Approved') {
      status = 'A';
    } else if (item.Status === 'Failed' || item.Status === 'Rejected') {
      status = 'R';
    } else {
      status = 'D';
    }
    const newObj = {
      transaction_id: item['@_id'],
      amount: item.PaymentDetails.Amount,
      currency_code: item.PaymentDetails.CurrencyCode,
      transaction_date: new Date(item.TransactionDate),
      status: status
    };
    if (newObj.transaction_id && newObj.amount && newObj.currency_code && newObj.transaction_date && newObj.status) {
      return newObj;
    } else {
      log.push(newObj);
    }
  });
  if (log.length > 0) {
    res.status(400).json({
      message: 'Invalid XML file',
      log: log
    });
    return;
  }
  try {
    await util.saveAll(newArr);
    res.status(200).json({
      message: 'XML file uploaded successfully',
      results: newArr
    });
  } catch (err) {
    res.status(500).json({
      error: err,
      log: log,
    });
  }
});

module.exports = router;
