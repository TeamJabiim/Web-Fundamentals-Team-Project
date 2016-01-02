/**
 * Created by Lyubomir on 28/09/2015.
 */
jQuery(function($){
    var socket = io.connect();
    var $messageForm = $('#send-message');
    var $senderName = $("#name");
    var $wishBox = $('#wishTable');
    var $wish = $("#wish");


    socket.emit('requestWishes');

    $messageForm.submit(function(e){

        var today = new Date();
        var time = [ today.getDate(), today.getMonth()+1,today.getFullYear()];
        socket.emit('new wish', [$senderName.val(), $wish.val() , time] );
        $wish.val('');
        $senderName.val('');
    });

    socket.on('update wishes', function(data){
        var newMsg ="<div class='col-xs-10 col-xs-offset-2'><blockquote><p>"+ data.msg + "</p><small>" + data.nick + "," +  data.time + "</small></blockquote></div>";
        $wishBox.append(newMsg);
    });

    socket.on('retrieveWishes',function(data){
        data.Messages.forEach(function(item){
            var newMsg ="<div class='col-xs-10 col-xs-offset-2'><blockquote><p>"+ item.msg + "</p><small>" + item.nick + "," +  item.time + "</small></blockquote></div>";
            $wishBox.append(newMsg);
        });

    });



});
