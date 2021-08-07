// Make connection
var socket = io.connect("http://localhost:8080/");

// Query DOM
var message = document.getElementById("message"),
    handle = document.getElementById("handle"),
    // btn = document.getElementById("send"),
    output = document.getElementById("output"),
    feedback = document.getElementById("feedback"),
    chatBody = document.getElementById("chatBody"),
    userList = document.getElementById("userList");

// On load, add new user send username to server
chatBody.onload = function () {
  // userList.innerHTML = "<li class='list-group-item'>" + handle.value + "</li>";
  socket.emit("new user", {
    newUser: handle.value
  });
};

// Render list of users to client
socket.on("get users", function(data) {
  // Bug might be in the implementation of this loop, although not very likely
  var html = "";
  for (i = 0; i < data.length; i++) {
    html += "<li class='list-group-item user'><strong>" + data[i] + "</strong></li>";
  }
  userList.innerHTML = html;
});

// Emit events
// Chat Step 1 - Listen for the enter key then send data to the server
message.addEventListener("keydown", function(e) {
  if (e.keyCode === 13) {
    socket.emit("chat", {
      message: message.value,
      handle: handle.value
    });
    // alert("Success!");
    // Clear message input form once entered
    message.value = "";
  }
});

// Chat Step 3 - Listen for events and post response
socket.on("chat", function(data) {
  // Scroll condition
  var isScrolledToBottom = chatWindow.scrollHeight - chatWindow.clientHeight <= chatWindow.scrollTop + 1;
  // Clear feedback broadcast once user is has sent a message
  feedback.innerHTML = "";
  // Chat output
  output.innerHTML += "<p><strong>" + data.handle + ": </strong>" + data.message + "</p>";
  // Scroll to the bottom if condition is true
  if(isScrolledToBottom) {
    chatWindow.scrollTop = chatWindow.scrollHeight - chatWindow.clientHeight;
  }
});

// Broadcast Typing Step 1 - Listen if someone is typing
message.addEventListener("keyup", function() {
  if (this.value.length > 0) {
    socket.emit("typing", handle.value);
  }
});

// Broadcast Typing Step 3 - Listen for events and post response
socket.on("typing", function(data) {
  feedback.innerHTML = "<p><em>" + data + " is typing...</em></p>";
});
