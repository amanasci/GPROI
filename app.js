var express = require('express');
var app = express();
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({posts:[]})
  .write()

// set the view engine to ejs
app.set('view engine', 'ejs');
// use res.render to load up an ejs view file

app.use(
    express.urlencoded({
      extended: true
    })
)
app.use(express.json())
app.use(express.static('public'));


function getday(date){
    var now = new Date(date);
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = now - start;
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay);
    return day
}

//update data to database
function updatedata(data){
    var datetime = new Date();
    var size = db.get('posts')
                    .filter({date: datetime.toISOString().slice(0,10).toString()})
                    .size()
                    .value()
    console.log(datetime.toISOString().slice(0,10))
    console.log(size)


    
    if(size==0){
        db.get('posts')
            .push({ date: datetime.toISOString().slice(0,10).toString() , task: 1})
            .write()
    } else{
        console.log("Updating existing date")
        var n = parseInt( db.get('posts')
                    .find({date: datetime.toISOString().slice(0,10).toString()})
                    .value()
                    .task
                    )
        
        db.get('posts')
            .find({date: datetime.toISOString().slice(0,10).toString()})
            .assign({ task: n+1})
            .write();
        
    }
}

function getdata(){
    arr = new Array(365).fill(0);

    var da = db.get('posts')
        .value()
    
    da.forEach(ele => {
        currday = getday(ele.date)
        if(ele.task>3){
            arr[currday-1]=3
        }
        else{
            arr[currday-1]=ele.task
        }
    });
    return arr
}

// index page
app.get('/', function(req, res) {
    data = getdata()
  res.render('index', {data: data});
});

app.post('/post', (req, res) => {
    var data = req.body.task
    if(data =="done" || data =="Done"){
    updatedata(data)
    }
    res.redirect('/');
  })

app.listen(8070);
console.log('Server is listening on port 8070');