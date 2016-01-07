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

    $("#navbar li").click(function () {

        $(this).siblings().removeClass("active");
        $(this).addClass("active");

    });

    socket.on("retrieveContent", function (data) {
        $("#content").empty();
        $("#content").append(data);
        if (currentTarget == "index") {
            socket.emit('requestWishes');
            delayedItems();
        }
    });

    socket.on('retrieveWishes', function (data) {
        data.Messages.forEach(function (item) {
            var newMsg = "<div class='col-xs-10 col-xs-offset-1 wishItem'><blockquote><p>" + item.msg + "</p><small>" + item.nick + "," + item.time + "</small></blockquote></div>";
            $('#wishTable').append(newMsg);
        });

    });
      socket.on('update wishes', function (data) {
        var newMsg = "<div class='col-xs-10 col-xs-offset-1 wishItem'><blockquote><p>" + data.msg + "</p><small>" + data.nick + "," + data.time + "</small></blockquote></div>";
        $('#wishTable').append(newMsg);
    });


    function delayedItems() {

        setTimeout(function () {
            $("#wishButton").click(function () {

                var today = new Date();
                var time = [today.getDate(), mS[today.getMonth()], today.getFullYear()];
                socket.emit('new wish', [$("#name").val(), $("#wishText").val(), time]);
                $(".form-control").val('').keyup();
                $("#close-btn").click();

            });
            $("#close-btn").click(function () {
                $(".form-control").val('');
                $(".form-control").keyup();
                
            });

            $("#name").keyup(function () {
                EmptyCheck($(this));
            });
            $("#wishText").keyup(function () {
                EmptyCheck($(this));
            });
        }, 1000);

    }

function EmptyCheck(item){
                if (item.val().trim() != '') {
                    if (item.is("#wishText")){
                      wishCheck = true;
                    }else{
                      nameCheck = true;
                    }
                    item.closest(".form-group").removeClass("has-error").addClass("has-success");
                
                }else {
                    if (item.is("#wishText")){
                        wishCheck = false;
                    }else{
                        nameCheck = false;
                    }
                    item.closest(".form-group").removeClass("has-success").addClass("has-error");
                }
        if (nameCheck && wishCheck) {

            $("#wishButton").removeAttr("disabled");
        } else {
            $("#wishButton").attr("disabled", true);
        }
    }
});


  
