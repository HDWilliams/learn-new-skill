// server.js
// where your node app starts

// init project
var SkillNames = require('./SkillNames').SkillNames;

var Request = require('request');
var YouTube = require('youtube-node');
let youTube = new YouTube();
youTube.setKey('');

var express = require('express');
var ejs = require('ejs');
var app = express();
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
const MONGO_URI = '';
mongoose.connect(MONGO_URI);


//Youtube Api get function

//set up Schema to access existing Skill db
const SkillSchema = new mongoose.Schema({
        name: String, 
        urls: [String]
})


const Skills = mongoose.model('Skills', SkillSchema, 'skills');

//access stored date in db
const datedb = new mongoose.Schema({
    StoredDay: Number,
    currentIndex: Number
})

const DateDB = mongoose.model('DatedDB', datedb, 'NewSkillDB');

let date = new Date;

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

//set view engine
app.set('views', './views')
app.set('view engine', 'ejs');


// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));


// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  //get the current day
  
  DateDB.findById('5b61cce5fb6fc072a40dc93e', function(err, day){
    
    if (err) throw err;
    //store current day 0-7
    var newCurrentIndex = day.currentIndex;
    
    //get array of all db items and clip newCurrentIndex
    Skills.find({}, function(err, data){
        if (err) throw err;
        if (newCurrentIndex > data.length){
          newCurrentIndex = 0
        }
      // Search youtube for video id of current skill obtained from db
      //render page
      youTube.search(data[newCurrentIndex].name, 10, function(err, results){
        console.log(data[newCurrentIndex]);
        console.log(results.items[0].id.videoId);
        var query = results.items[0].id.videoId;
        response.render(__dirname + '/views/index.ejs', {query: query});
      });
        

    if (date.getDay() !== day.StoredDay){
      newCurrentIndex += 1;
      DateDB.findByIdAndUpdate('5b61cce5fb6fc072a40dc93e', {StoredDay: date.getDay(), currentIndex: newCurrentIndex },function(err, day){
        if (err) throw err;
      })
      
    } 
  })

});
});

app.post('/', function(request, response){
  console.log(request.body.Skill);
  Skills.collection.insertOne({urls:[], name: request.body.Skill}, function(err, data){
    if (err) {
      throw err;
    }else {
      console.log('Success');
    }
  });
  response.status(302);
})

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
