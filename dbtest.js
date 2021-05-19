var express = require('express');
var app = express();
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({posts:[]})
  .write()

var datetime = new Date();
var bo = db.get('posts')
.filter({date: datetime.toISOString().slice(0,10)})
.size()
.value()

db.get('posts')
.find({date: datetime.toISOString().slice(0,10)})
.assign({ task: 'hi!'})
.write();

console.log(bo)

app.listen(8080);
console.log('Server is listening on port 8080');