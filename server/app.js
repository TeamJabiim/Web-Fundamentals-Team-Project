var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    fs = require("fs"),
    wishes={}
    clients=[];

fs.readFile('data.json', 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }
    wishes = JSON.parse(data);
});
app.use(express.static('../'));
server.listen(8888);

io.sockets.on('connection', function(socket){
    clients[socket.id] = socket;


    socket.on('new wish', function(data){
        var obj = {msg: data[1] ,nick: data[0] , time: data[2]};
        io.sockets.emit('update wishes', obj);
        wishes.Messages.push(obj);
        fs.writeFile("data.json",JSON.stringify(wishes));

    });
 socket.on('requestWishes', function(){
     clients[socket.id].emit('retrieveWishes', wishes);
   });

});
