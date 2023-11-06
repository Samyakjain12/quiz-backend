require('dotenv').config({ path: '.env' });
const url = require('url')
const express = require('express')
const path = require('path')
global.appRoot = path.resolve(__dirname)
const bodyParser = require('body-parser')

global._pathconst = require('./api/helpers/pathconst.js')
const ResHelper = require(_pathconst.FilesPath.ResHelper);
const _dbContaxt = require(_pathconst.FilesPath.DBContaxt);

global.knexSqlDb = _dbContaxt.getContext();

const app = express()


app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' })); //handle queryStrings

app.use(bodyParser.json({ limit: '100mb' }))




app.use(function (req, res, next) {
  res.requestCustomObject = req;
  
  res.setHeader('Content-Type', 'application/json; charset=UTF-8');
  
  res.setHeader('Access-Control-Allow-Origin', '*');

  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Accept,Authorization');

  res.setHeader('Access-Control-Allow-Credentials', true);

  const hrTime = process.hrtime();
  req.id = hrTime[0] * 1000000000 + hrTime[1];

  next();
});



app.use('/v1', require(_pathconst.FilesPath.Routes));

app.use((err, req, res, next) => {
  if (err && err.error && err.error.isJoi) {
    let errDetail = []
    // we had a joi error, let's return a custom 400 json response
    if (err.error.details) {
      err.error.details.map(function (item) {
        var temp = {}
        temp[item.context.key] = item.message
        errDetail.push(temp)
      })
    }

    ResHelper.apiResponse(res, false, "Submitted Information is not valid.", 400, errDetail, "");

  } else {

    ResHelper.apiResponse(res, false, "Error Occured.", 500, err, "");

  }
});


module.exports = app