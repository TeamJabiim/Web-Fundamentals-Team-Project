var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    fs = require("fs"),
    wishes={};

fs.readFile('data.json', 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }
    try{
    wishes = JSON.parse(data);
    } catch(err){
        console.log(err + "\n" + data);
    }
});

var index = fs.readFileSync(__dirname + "/public/partials/index_partial.html", 'utf8');
var about = fs.readFileSync(__dirname + "/public/partials/about_partial.html", 'utf8');
var jokes = fs.readFileSync(__dirname + "/public/partials/jokes_partial.html", 'utf8');

app.use(express.static(__dirname + "/public"));

server.listen(8080);

io.sockets.on('connection', function(socket){



    socket.on('new wish', function(data){
        var obj = {msg: data[1] ,nick: data[0] , time: data[2]};
        io.sockets.emit('update wishes', obj);
        wishes.Messages.push(obj);
        fs.writeFile("data.json",JSON.stringify(wishes));

    });
 socket.on('requestWishes', function(){
     socket.emit('retrieveWishes', wishes);
   });

 socket.on("requestContent",function(data){
    
if(data == "index"){
    
    socket.emit("retrieveContent",index); 

}else if(data == "about"){
     socket.emit("retrieveContent",about);

}else if(data == "jokes"){
     socket.emit("retrieveContent",jokes);
}



 });



});
