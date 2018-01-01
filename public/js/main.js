var socket = io.connect('http://localhost:8080');

var espaceConnexionElt = document.getElementById("espaceConnexion");
var espaceChatElt = document.getElementById("espaceChat");
var conversationElt = document.getElementById("conversation");
var utilisateursConnectesElt = document.getElementById("utilisateursConnectes");
var pseudo = "";

// We send a message to server when we click on the button
document.getElementById("connecter").addEventListener("click", function () {
  if(document.getElementById("nouveauPseudo").value !== ''){
    // The content of the message is the value of "nouveauMessage" field and the login of the user
    pseudo = document.getElementById("nouveauPseudo").value;
    socket.emit('pseudoConnecte', pseudo);
    espaceConnexionElt.setAttribute("hidden", true);
    espaceChatElt.style.visibility = "visible";
    document.getElementById("nouveauMessage").focus();
  }
});

// We send a message to server when we click on the button "envoyer"
document.getElementById("envoyer").addEventListener("click", function () {
    var now = new Date();
    var msg = document.getElementById("nouveauMessage").value;
    // Message : value of "nouveauMessage" field, login of the user, time of click
    if (msg !== '') {
      socket.emit('messageClient',
        {content: msg, author: pseudo, time: now.toTimeString(), recipient: 'everyone'});
      document.getElementById("nouveauMessage").value = '';
    }
});

// When we get a messageServeur, we add the message to the client page
socket.on('messageServeur', function(message) {
  addMessage(message);
  conversationElt.scrollTop = conversationElt.scrollHeight;
});

// When we get a messagePriveServeur, we add the message to the client page
socket.on('messagePriveServeur', function(message) {
  addMessage(message);
  conversationElt.scrollTop = conversationElt.scrollHeight;
});

// We send a message to server when we click on the button "mouette"
document.getElementById("btnMouette").addEventListener("click", function () {
    socket.emit('boutonSon', {son: 'mouette', recipient: 'everyone', recipientId: ''});
});

// We send a message to server when we click on the button "cougar"
document.getElementById("btnCougar").addEventListener("click", function () {
    socket.emit('boutonSon', {son: 'cougar', recipient: 'everyone', recipientId: ''});
});

// When we get a sound from the server, we play "data".mp3 and display an information
socket.on('son', function(data) {
  play(data.son, this);
});
socket.on('messageSon', function(message) {
  addInfo(message);
});

// When we get a messageNouvelleConnexion, we add an connection information to the client page
socket.on('messageNouvelleConnexion', function(message){
  addInfo(message);
});

// When someone connects, we display the login into "connected users" box
// We add 3 buttons to send private messages and sounds
socket.on('messageListeUtilisateurs', function(users){
  utilisateursConnectesElt.innerHTML = "";
  users.user.forEach(function(user) {
    var userElt = document.createElement("li");
    userElt.setAttribute("class","list-group-item");
    var pseudoElt = document.createElement("span");
    pseudoElt.textContent = '  ' + user.pseudo;
    var btnMsgElt = document.createElement("button");
    btnMsgElt.setAttribute("class", "btn btn-primary btn-sm glyphicon glyphicon-comment");
    btnMsgElt.setAttribute("id", user.id);
    var btnSon1 = document.createElement("button");
    btnSon1.setAttribute("class", "btn btn-warning btn-sm glyphicon glyphicon-music");
    btnSon1.setAttribute("id", "mouette_" + user.id);
    var btnSon2 = document.createElement("button");
    btnSon2.setAttribute("class", "btn btn-danger btn-sm glyphicon glyphicon-music");
    btnSon2.setAttribute("id", "cougar_" + user.id);

    utilisateursConnectesElt.appendChild(userElt);
    userElt.appendChild(btnMsgElt);
    userElt.appendChild(btnSon1);
    userElt.appendChild(btnSon2);
    userElt.appendChild(pseudoElt);

    // Click on the message button next to an user and send him a private message
    document.getElementById(user.id).addEventListener("click", function (){
      var now = new Date();
      var msg = document.getElementById("nouveauMessage").value;
      if (msg !== '') {
        socket.emit('messagePriveClient', {id: user.id,
          message: {content: msg, author: pseudo, time: now.toTimeString(), recipient: user.pseudo}});
        document.getElementById("nouveauMessage").value = '';
      }
    });

    // Click on the music button next to an user and send him a private sound (mouette)
    document.getElementById('mouette_' + user.id).addEventListener("click", function (){
      socket.emit('boutonSon', {son: 'mouette', recipient: user.pseudo, recipientId: user.id});
    });

    // Click on the music button next to an user and send him a private sound (cougar)
    document.getElementById('cougar_' + user.id).addEventListener("click", function (){
      socket.emit('boutonSon', {son: 'cougar', recipient: user.pseudo, recipientId: user.id});
    });

  });
});

// When someone disconnects, we display an information on the client page
socket.on('messageDeconnexion', function(message){
  addInfo(message);
});

// addMessage function takes an object with properties "author" and "content" as parameter
// addMessage function add a new line with author and message in conversationElt div
function addMessage(message){
  // DOM elements
  var ligneElt = document.createElement("div");
  var headerElt = document.createElement("div");
  var pseudoElt = document.createElement("strong");
  var timeElt = document.createElement("small");
  var recipientElt = document.createElement("span");
  var messageElt = document.createElement("div");
  ligneElt.setAttribute("class", "msg");
  timeElt.setAttribute("class", "pull-right text-muted");
  // Content
  pseudoElt.textContent = message.author;
  messageElt.textContent = message.content;
  timeElt.textContent = message.time;
  recipientElt.textContent = ' (to ' + message.recipient + ')';
  // We add the new elements to the document
  conversationElt.appendChild(ligneElt);
  ligneElt.appendChild(headerElt);
  headerElt.appendChild(pseudoElt);
  headerElt.appendChild(timeElt);
  headerElt.appendChild(recipientElt);
  ligneElt.appendChild(messageElt);
};

// addInfo function takes a string as parameter
// addInfo function add a new line with the new connected login in conversationElt div
function addInfo(message){
  var connectionInfo = document.createElement("div");
  connectionInfo.setAttribute("class", "msg");
  connectionInfo.textContent = message;
  connectionInfo.style.fontWeight = "bold";
  conversationElt.appendChild(connectionInfo);
};

function play(idPlayer, control) {
    var player = document.querySelector('#' + idPlayer);
        player.play();
}
