var express = require('express');
var router = express.Router();
var { UserClient } = require('./UserClient')

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { title: 'Crime Registry' });
});

router.get('/registration', (req, res) => {
  res.render('registration', { title: 'Crime Registry' });
});

router.post('/add', function (req, res) {
  const dat = req.body;
  var client = new UserClient();
  client.adddetails("Add-details", dat.key, dat.aadhaar, dat.name, dat.id, dat.type, dat.district, dat.ps, dat.stu)
  res.send({ message: "Request sent!" });
});

router.get('/view', (req, res) => {
  res.render('view', { title: 'Crime Registry' });
});

router.post('/viewdetails', async (req, res) => {

  let adh = req.body.aadhaar;
  var client = new UserClient();
  let stateData = await client.getDetails(adh);
  let persondetails = [];
  stateData.data.forEach(person => {
    let decodeddata = Buffer.from(person.data, 'base64').toString();
    let details = decodeddata.split(',');
    persondetails.push({ aadhaar: details[0], name: details[1], id: details[2], type: details[3], dist: details[4], ps: details[5], ts: details[6] })
  });
  res.send({ pdetails: persondetails });
});

router.get('/update', (req, res) => {
  res.render('update', { title: 'Crime Registry' });
});

router.post('/updatedetails', async (req, res) => {
  let adh = req.body.aadhaar;
  let case_id = req.body.id;
  var client = new UserClient();
  let stateData = await client.getCaseDetails(adh, case_id);
  details = stateData.split(',');
  res.send({ aadhaar: details[0], name: details[1], case_id: details[2], type: details[3], dist: details[4], ps: details[5], ts: details[6] });
});

router.post('/statusChange', function (req, res) {
  const dat = req.body;
  var client = new UserClient();
  client.adddetails("Update-details", dat.key, dat.aadhaar, dat.name, dat.id, dat.type, dat.district, dat.ps, dat.stu)
  res.send({ message: "Request sent!" });
});

router.post('/deletecase', function (req, res) {
  const dat = req.body;
  var client = new UserClient();
  client.deletedetails("Delete-details", dat.key, dat.aadhaar, dat.id)
  res.send({ message: "Request sent!" });
});

router.get('/receipt', (req, res) => {
  res.render('receipt', { title: 'Crime Registry' });
});

router.post('/trnreceipt', async (req, res) => {
  let rect = req.body.rec;
  var client = new UserClient();
  let transactionData = await client.getreceipt(rect);
  res.send({ transactionData: transactionData });
});

module.exports = router;
