/**
 * Created by ashishtyagi9622 on 18/6/19.
 */
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(express.static(__dirname+'/public'));
app.get('/',function (req,res) {
    res.sendFile(__dirname+'/public/index.html');
});
app.get('/getData',function (req,res) {
    res.json([]);
});
app.listen(port, function (err) {
    console.log('Server is listening on port ',port);
});