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

    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    if (urlParams.has("refresh")) {
        var refreshParam = parseInt(urlParams.get("refresh"));
        setTimeout(function() {
            location.reload();
        }, refreshParam);
    }

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

    backgroundView = document.createElement("div");
    backgroundView.style.position = "absolute";
    backgroundView.style.opacity = "0.3";
    backgroundView.style.filter = "grayscale(1)";
    backgroundView.style.background = "#ccc";
    backgroundView.style.backgroundPosition = "25%";
    backgroundView.style.backgroundSize = "cover";
    backgroundView.style.backgroundImage = 
    "url('img/background-0.png')";
    backgroundView.style.display = "flex";
    backgroundView.style.flexDirection = "column";
    backgroundView.style.left = (0)+"px";
    backgroundView.style.top = (0)+"px";
    backgroundView.style.width = (sw)+"px";
    backgroundView.style.height = (sh-50)+"px";
    backgroundView.style.overflowY = "scroll";
    backgroundView.style.zIndex = "15";
    //document.body.appendChild(backgroundView);

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

    countView = document.createElement("span");
    countView.style.position = "absolute";
    countView.type = "text";
    countView.innerText = "0 online";
    countView.style.textAlign = "center";
    countView.style.left = (sw-100)+"px";
    countView.style.top = (sh-75)+"px";
    countView.style.width = (100)+"px";
    countView.style.height = (25)+"px";
    countView.style.border = "1px solid #000";
    countView.style.zIndex = "15";
    document.body.appendChild(countView);

    var showNameField = true;
    nameChangeView = document.createElement("i");
    nameChangeView.style.position = "absolute";
    nameChangeView.style.color = "#336";
    nameChangeView.style.textAlign = "center";
    nameChangeView.style.fontSize = "20px";
    nameChangeView.className = "fa-solid fa-caret-left";
    nameChangeView.style.left = ((sw/3)-12.5)+"px";
    nameChangeView.style.top = (sh-75)+"px";
    nameChangeView.style.width = (25)+"px";
    nameChangeView.style.height = (25)+"px";
    nameChangeView.style.zIndex = "15";
    document.body.appendChild(nameChangeView);

    nameChangeView.onclick = function() {
        showNameField = !showNameField;
        if (showNameField) {
            nameChangeView.className = "fa-solid fa-caret-left";
            nameChangeView.style.left = ((sw/3)-12.5)+"px";
            sourceView.style.display = "initial";

            textView.style.left = (sw/3)+"px";
            textView.style.width = ((sw/3)+((sw/3)/2))+"px";
        }
        else {
            nameChangeView.className = "fa-solid fa-caret-right";
            nameChangeView.style.left = (0)+"px";
            sourceView.style.display = "none";

            textView.style.left = (0)+"px";
            textView.style.width = (((sw/3)*2)+((sw/3)/2))+"px";
        }
    }

    sourceView = document.createElement("input");
    sourceView.style.position = "absolute";
    sourceView.type = "text";
    sourceView.placeholder = "Name...";
    sourceView.style.left = (0)+"px";
    sourceView.style.top = (sh-50)+"px";
    sourceView.style.width = (sw/3)+"px";
    sourceView.style.height = (50)+"px";
    sourceView.style.border = "1px solid #000";
    sourceView.style.zIndex = "15";
    document.body.appendChild(sourceView);

    textView = document.createElement("input");
    textView.style.position = "absolute";
    textView.type = "text";
    textView.placeholder = "Your text here...";
    textView.style.left = (sw/3)+"px";
    textView.style.top = (sh-50)+"px";
    textView.style.width = ((sw/3)+((sw/3)/2))+"px";
    textView.style.height = (50)+"px";
    textView.style.border = "1px solid #000";
    textView.style.zIndex = "15";
    document.body.appendChild(textView);

    sendLeftView = document.createElement("button");
    sendLeftView.style.position = "absolute";
    sendLeftView.style.background = "#336";
    sendLeftView.style.color = "#fff";
    sendLeftView.innerText = "SEND";
    sendLeftView.style.left = (((sw/3)*2)+((sw/3)/2))+"px";
    sendLeftView.style.top = (sh-50)+"px";
    sendLeftView.style.width = ((sw/3)/2)+"px";
    sendLeftView.style.height = (50)+"px";
    sendLeftView.style.zIndex = "15";
    document.body.appendChild(sendLeftView);

    sendRightView = document.createElement("button");
    sendRightView.style.position = "absolute";
    sendRightView.innerText = "SEND RIGHT";
    sendRightView.style.left = (((sw/3)*2)+((sw/3)/2))+"px";
    sendRightView.style.top = (sh-50)+"px";
    sendRightView.style.width = ((sw/3)/2)+"px";
    sendRightView.style.height = (50)+"px";
    sendRightView.style.zIndex = "15";
    //document.body.appendChild(sendRightView);

    sendLeftView.onclick = function() {
        var from = sourceView.value;
        var text = textView.value;

        if (from.length < 3) return;
        if (text.replace(" ", "").length < 1) return;

        if (text == "eruda")
        eruda.init();
        else if (text != "clear")
        send(from, text);
        else 
        clearHistory();

        textView.value = "";
    };

    sendRightView.onclick = function() {
        var from = playerId;
        var text = textView.value;

        if (text == "eruda")
        eruda.init();
        else if (text != "clear")
        send("right", text);
        else 
        clearHistory();

        textView.value = "";
    };

    $.ajax({
        url: "https://websocket-sv.onrender.com/",
        type: "GET"
    });

    setInterval(function() {
        $.ajax({
            url: "https://chat-client-h3ry.onrender.com/ajax/time.php",
            type: "GET"
        });
    }, 60000);

    var countTimeout = 0;
    ws.onmessage = function(e) {
        var msg = e.data.split("|");
        if (msg[0] == "PAPER" &&
            msg[1] != playerId &&
            msg[2] == "update") {
            loadHistory();
        }
        else if (msg[0] == "PAPER" &&
            msg[1] != playerId &&
            msg[2] == "request-count") {
            ws.send("PAPER|"+playerId+"|connected");
        }
        else if (msg[0] == "PAPER" &&
            msg[1] != playerId &&
            msg[2] == "connected") {
            connectedCount += 1;
        }
    };

    var connectedCount = 0;
    setInterval(function() {
        connectedCount = 0;
        ws.send("PAPER|"+playerId+"|request-count");

        clearTimeout(countTimeout);
        countTimeout = setTimeout(function() {
            countView.innerText = connectedCount+" online";
        }, 1000);
    }, 5000);

    ws.send("PAPER|"+playerId+"|request-count");

    loadHistory();

    //eruda.destroy();
});

var historyArr = [];
var loadHistory = function() {
    $.ajax({
        url: "ajax/mysql-db.php",
        type: "GET",
        success: function(data) {
            var obj = JSON.parse(data);
            historyArr = obj;
            drawHistory(obj);
    }});
};

var uploadMessage = function(from, text) {
    $.ajax({
        url: "ajax/mysql-db.php",
        type: "POST",
        data: { 
            action: "include",
            from: from,
            text: text
        },
        success: function(data) {
            ws.send("PAPER|"+playerId+"|update");
            loadHistory();
    }});
};

var clearHistory = function() {
    $.ajax({
        url: "ajax/mysql-db.php",
        type: "POST",
        data: { 
            action: "clear",
        },
        success: function(data) {
            ws.send("PAPER|"+playerId+"|update");
            loadHistory();
    }});
};

var getLevel = function(source) {
     var level = 
     historyArr.filter((o) => { return o.source == source; }).length;
     return level;
};

var drawHistory = function(arr) {
    historyView.innerHTML = "";
    for (var n = 0; n < arr.length; n++) {
        if (arr[n].text.replace(" ", "").length < 1) continue;

        var level = getLevel(arr[n].source, arr);

        var messageView = document.createElement("span");
        //messageView.style.position = "relative";
        messageView.style.background = "#fff";
        messageView.style.filter = 
        "drop-shadow(0px 1px 1px #000)";
        messageView.style.textWrap = "wrap";
        messageView.innerHTML = 
        "<b style=\"position:relative;left:-10px;top:-5px;"+
        "background:#336;color:#fff;"+
        "font-size:10px;padding:5px;\"> "+arr[n].source+
        ":&nbsp;</b>"+
        "&nbsp;<span style=\"position:absolute;top:5px;right:5px;"+
        "font-size:10px;\">"+
        formatTime(arr[n].timestamp)+
        "</span>"+
        "<br>"+arr[n].text;
        //messageView.style.width = (sw)+"px";
        //messageView.style.height = (50)+"px";
        messageView.style.padding = "10px";
        messageView.style.margin = "10px";
        messageView.style.marginBottom = 
        n < (arr.length-1) ? "0px" : (50)+"px";
        messageView.style.zIndex = "15";
        historyView.appendChild(messageView);
    }

    historyView.scrollTo(0, historyView.scrollHeight);
};

var formatTime = function(time) {
    var year = time.substring(0, 4);
    var month = time.substring(5, 7);
    var day = time.substring(8, 10);
    var hours = time.substring(11, 13);
    var minutes = time.substring(14, 16);
    var seconds = time.substring(17, 19);

    return day+"/"+month+"/"+year+" "+hours+":"+minutes+":"+seconds;
};

var send = function(from, text) {
    uploadMessage(from, text);
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