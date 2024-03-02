var uploadAlert = new Audio("audio/ui-audio/upload-alert.wav");
var warningBeep = new Audio("audio/warning_beep.wav");

var sw = 360; //window.innerWidth;
var sh = 669; //window.innerHeight;
var swo = sw-100;

var gridSize = 10;

if (window.innerWidth > window.innerHeight) {
    sw = window.innerWidth;
    sh = window.innerHeight;
    gridSize = 20;
}

var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
if (urlParams.has("height"))
sh = parseInt(urlParams.get("height"));

var audioBot = true;
var playerId = new Date().getTime();

var canvasBackgroundColor = "rgba(255,255,255,1)";
var backgroundColor = "rgba(50,50,65,1)";
var buttonColor = "rgba(75,75,90,1)";

var audioStream = 
new Audio("audio/music/ringtone-0.wav");

// Botão de gravação
$(document).ready(function() {
    $("html, body").css("overscroll-behavior", "none");
    $("html, body").css("overflow", "hidden");
    $("html, body").css("background", "#fff");

    $("#title").css("font-size", "15px");
    $("#title").css("color", "#fff");
    $("#title").css("top", "10px");
    $("#title").css("z-index", "25");

    // O outro nome não era [  ]
    // Teleprompter
    $("#title")[0].innerText = ""; //"PICTURE DATABASE"; 
    $("#title")[0].onclick = function() {
        var text = prompt();
        sendText(text);
    };

    tileSize = (sw/7);

    camera = document.createElement("video");
    camera.style.position = "absolute";
    camera.style.display = "none";
    camera.autoplay = true;
    camera.style.objectFit = "cover";
    camera.width = (sw);
    camera.height = (sh); 
    camera.style.left = (0)+"px";
    camera.style.top = (0)+"px";
    camera.style.width = (sw)+"px";
    camera.style.height = (sh)+"px";
    camera.style.zIndex = "15";
    document.body.appendChild(camera);
    cameraElem = camera;

    historyView = document.createElement("div");
    historyView.style.position = "absolute";
    historyView.style.background = "#ccc";
    historyView.style.display = "flex";
    historyView.style.flexDirection = "column";
    historyView.style.left = (0)+"px";
    historyView.style.top = (0)+"px";
    historyView.style.width = (sw)+"px";
    historyView.style.height = (sh-50)+"px";
    historyView.style.overflowY = "scroll";
    historyView.style.zIndex = "15";
    document.body.appendChild(historyView);

    textView = document.createElement("input");
    textView.style.position = "absolute";
    textView.type = "text";
    textView.placeholder = "Your text here...";
    textView.style.left = (0)+"px";
    textView.style.top = (sh-50)+"px";
    textView.style.width = ((sw/3)*2)+"px";
    textView.style.height = (50)+"px";
    textView.style.zIndex = "15";
    document.body.appendChild(textView);

    sendView = document.createElement("button");
    sendView.style.position = "absolute";
    sendView.innerText = "SEND";
    sendView.style.left = ((sw/3)*2)+"px";
    sendView.style.top = (sh-50)+"px";
    sendView.style.width = (sw/3)+"px";
    sendView.style.height = (50)+"px";
    sendView.style.zIndex = "15";
    document.body.appendChild(sendView);

    sendView.onclick = function() {
        var from = playerId;
        var text = textView.value;

        send(from, text);
        textView.value = "";
    };

    ws.onmessage = function(e) {
        var msg = e.data.split("|");
        if (msg[0] == "PAPER" &&
            msg[1] != playerId &&
            msg[2] == "update") {
            loadHistory();
        }
    };

    loadHistory();

    //eruda.destroy();
});

var loadHistory = function() {
    $.ajax({
        url: "ajax/mysql-db.php",
        type: "GET",
        success: function(data) {
            var obj = JSON.parse(data);
            drawHistory(obj);
    }});
};

var uploadMessage = function(text) {
    $.ajax({
        url: "ajax/mysql-db.php",
        type: "POST",
        data: { 
            action: "include",
            text: text
        },
        success: function(data) {
            ws.send("PAPER|"+playerId+"|update");
            loadHistory();
    }});
};

var drawHistory = function(arr) {
    historyView.innerHTML = "";
    for (var n = 0; n < arr.length; n++) {
        var messageView = document.createElement("span");
        //messageView.style.position = "absolute";
        messageView.style.background = "#fff";
        messageView.style.textWrap = "wrap";
        messageView.innerHTML = "<b>Message No. "+
        (n+1).toString().padStart(3, "0")+":&nbsp;</b>"+arr[n].text;
        //messageView.style.width = (sw)+"px";
        //messageView.style.height = (50)+"px";
        messageView.style.padding = "10px";
        messageView.style.margin = "10px";
        messageView.style.marginBottom = "0px";
        messageView.style.zIndex = "15";
        historyView.appendChild(messageView);
    }

    historyView.scrollTo(0, historyView.scrollHeight);
};

var send = function(from, text) {
    uploadMessage(text);
};

var visibilityChange;
if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
  visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
  visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
  visibilityChange = "webkitvisibilitychange";
}
//^different browsers^

var backgroundMode = false;
document.addEventListener(visibilityChange, function(){
    var currentTime = new Date().getTime();
    backgroundMode = !backgroundMode;
    if (backgroundMode) {
        console.log("backgroundMode: "+backgroundMode+" - "+
        moment(currentTime).format("HH:mm SSS"));
    }
    else {
        console.log("backgroundMode: "+backgroundMode+" - "+
        moment(currentTime).format("HH:mm SSS"));
    }
}, false);