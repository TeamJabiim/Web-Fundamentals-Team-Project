/**
 * Created by Lyubomir on 28/09/2015.
 */
jQuery(function ($) {
    var socket = io.connect();

    var mS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    var target;
    var currentTarget;
    var nameCheck = false;
    var wishCheck = false;


    setInterval(function () {

        var pathname = document.URL;
        if (pathname.indexOf("#") > -1) {
            target = pathname.substr(pathname.indexOf("#") + 1, pathname.length);
        } else {
            target = "index"
        }

        if (target != currentTarget) {
            socket.emit("requestContent", target);
            currentTarget = target;
        }


    }, 60);


    $("#navbar li").click(function(){

       $(this).siblings().removeClass("active");
       $(this).addClass("active");

    });





    $("#name").keyup(function () {
        if ($(this).val().trim() != '') {
            nameCheck = true;
            $(this).closest(".form-group").removeClass("has-error").addClass("has-success");
        } else {
            nameCheck = false;
            $(this).closest(".form-group").removeClass("has-success").addClass("has-error");
        }
        unlockButton();
    });
    $("#wishText").keyup(function () {
        if ($(this).val().trim() != '') {
            wishCheck = true;
            $(this).closest(".form-group").removeClass("has-error").addClass("has-success");
        } else {
            wishCheck = false;
            $(this).closest(".form-group").removeClass("has-success").addClass("has-error");
        }
        unlockButton();
    });



    $('#send-message').submit(function (e) {
        var today = new Date();
        var time = [today.getDate(), mS[today.getMonth()], today.getFullYear()];
        socket.emit('new wish', [$("#name").val(), $("#wishText").val(), time]);
        $("#wishText").val('');
        $("#name").val('');
    });

    socket.on('update wishes', function (data) {

        var newMsg = "<div class='col-xs-10 col-xs-offset-1 wishItem'><blockquote><p>" + data.msg + "</p><small>" + data.nick + "," + data.time + "</small></blockquote></div>";

        var newMsg = "<div class='col-xs-10 col-xs-offset-1 wishItem'><blockquote><p>" + data.msg + "</p><small> " + data.nick + ", " + data.time + "</small></blockquote></div>";

        $('#wishTable').append(newMsg);
    });

    socket.on("retrieveContent", function (data) {
        $("#content").empty();
        $("#content").append(data);
        if (currentTarget == "index") {
            socket.emit('requestWishes');

        }


    });

    socket.on('retrieveWishes', function (data) {

        data.Messages.forEach(function (item) {

            var newMsg = "<div class='col-xs-10 col-xs-offset-1 wishItem'><blockquote><p>" + item.msg + "</p><small>" + item.nick + "," + item.time + "</small></blockquote></div>";

            var newMsg = "<div class='col-xs-10 col-xs-offset-1 wishItem'><blockquote><p>" + item.msg + "</p><small> " + item.nick + ", " + item.time + "</small></blockquote></div>";

            $('#wishTable').append(newMsg);
        });

    });


});




function unlockButton() {
    if (nameCheck && wishCheck) {
        $("#wishButton").removeAttr("disabled");
    } else {
        $("#wishButton").attr("disabled", true);
    }

}


