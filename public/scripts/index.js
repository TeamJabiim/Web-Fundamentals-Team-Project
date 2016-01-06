/**
 * Created by Lyubomir on 28/09/2015.
 */
jQuery(function($){
    var socket = io.connect();
    var $messageForm = $('#send-message');
    var $senderName = $("#name");
    var $wishBox = $('#wishTable');
    var $wish = $("#wishText");
    var mS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

    socket.emit('requestWishes');


    var nameCheck = false;
    var wishCheck = false;

    $senderName.keyup(function(){
       if($(this).val().trim() != ''){
           nameCheck=true;
           $(this).closest(".form-group").removeClass("has-error").addClass("has-success");
       }else{
           nameCheck=false;
           $(this).closest(".form-group").removeClass("has-success").addClass("has-error");
       }
        unlockButton();
    });
    $wish.keyup(function(){
        if($(this).val().trim() != ''){
            wishCheck=true;
            $(this).closest(".form-group").removeClass("has-error").addClass("has-success");
        }else{
            wishCheck=false;
            $(this).closest(".form-group").removeClass("has-success").addClass("has-error");
        }
        unlockButton();
    });

function unlockButton(){
    if(nameCheck && wishCheck){
    $("#wishButton").removeAttr("disabled");
    }else{
    $("#wishButton").attr("disabled",true);
    }

}

    $messageForm.submit(function(e){
        var today = new Date();
        var time = [ today.getDate(), mS[today.getMonth()],today.getFullYear()];
        socket.emit('new wish', [$senderName.val(), $wish.val() , time] );
        $wish.val('');
        $senderName.val('');
    });

    socket.on('update wishes', function(data){

        var newMsg ="<div class='col-xs-10 col-xs-offset-1 wishItem'><blockquote><p>"+ data.msg + "</p><small>" + data.nick + "," +  data.time + "</small></blockquote></div>";

        var newMsg ="<div class='col-xs-10 col-xs-offset-1 wishItem'><blockquote><p>"+ data.msg + "</p><small> " + data.nick + ", " +  data.time + "</small></blockquote></div>";

        $wishBox.append(newMsg);
    });

    socket.on('retrieveWishes',function(data){
        data.Messages.forEach(function(item){

            var newMsg ="<div class='col-xs-10 col-xs-offset-1 wishItem'><blockquote><p>"+ item.msg + "</p><small>" + item.nick + "," +  item.time + "</small></blockquote></div>";

            var newMsg ="<div class='col-xs-10 col-xs-offset-1 wishItem'><blockquote><p>"+ item.msg + "</p><small> " + item.nick + ", " +  item.time + "</small></blockquote></div>";

            $wishBox.append(newMsg);
        });

    });



});

