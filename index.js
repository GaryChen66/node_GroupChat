//Import Libraries
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

//Chatter List
var chatter_list = [];
var room_list = ["room no1", "room no2", "room no3"];

//App Routing
app.get("/", function(req, res) {
  res.render("index.ejs");
});

function addToChatterList(username) {
  if (chatter_list.indexOf(username) == -1) {
    chatter_list.push(username);
    return true;
  }
  return false;
}

function removeChatter(username) {
  var index = chatter_list.indexOf(username);
  if (index > -1) {
    chatter_list.splice(index, 1);
  }
}

io.sockets.on("connection", function(socket) {
  socket.on("username", function(username) {
    socket.username = username;

    if (addToChatterList(username)) {
      io.emit(
        "is_online",
        "🔵<i>" + socket.username + " joined the chat..</i>"
      );
      io.emit("chatter_list", chatter_list);
    }
  });

  socket.on("disconnect", function() {
    io.emit("is_online", "🔴<i>" + socket.username + " left the chat.</i>");
    removeChatter(socket.username);
    io.emit("chatter_list", chatter_list);
  });

  socket.on("chat_message", function(message) {
    io.emit(
      "chat_message",
      "<strong>" + socket.username + "</strong>:" + message
    );
  });
});

//Http Server

const server = http.listen(8080, function() {
  console.log("Listening on port 8080.");
});
