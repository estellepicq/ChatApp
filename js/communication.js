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
    // Message : value of "nouveauMessage" field, login of the user, time of click
    socket.emit('messageClient',
      {content: document.getElementById("nouveauMessage").value, author: pseudo, time: now.toTimeString()});
    document.getElementById("nouveauMessage").value = "";
});

// When we get a messageServeur, we add the message to the client page
socket.on('messageServeur', function(message) {
  addMessage(message);
  conversationElt.scrollTop = conversationElt.scrollHeight;
});

// We send a message to server when we click on the button "mouette"
document.getElementById("btnMouette").addEventListener("click", function () {
    socket.emit('boutonSon', 'mouette');
});

// We send a message to server when we click on the button "pet"
document.getElementById("btnPet").addEventListener("click", function () {
    socket.emit('boutonSon', 'pet');
});

// When we get a sound from the server, we play "data".mp3 and display an information
socket.on('son', function(data) {
  play(data, this);
});
socket.on('messageSon', function(message) {
  addInfo(message);
});

// When we get a messageNouvelleConnexion, we add an connection information to the client page
socket.on('messageNouvelleConnexion', function(message){
  addInfo(message);
});

// When someone connects, we display the login into "connected users" box
socket.on('messageListeUtilisateurs', function(liste){
  utilisateursConnectesElt.innerHTML = "";
  liste.forEach(function(user){
    var userElt = document.createElement("li");
    userElt.setAttribute("class","list-group-item");
    userElt.textContent = user;
    utilisateursConnectesElt.appendChild(userElt);
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
  var messageElt = document.createElement("div");
  ligneElt.setAttribute("class", "msg");
  timeElt.setAttribute("class", "pull-right text-muted");
  // Content
  pseudoElt.textContent = message.author;
  messageElt.textContent = message.content;
  timeElt.textContent = message.time;
  // We add the new elements to the document
  conversationElt.appendChild(ligneElt);
  ligneElt.appendChild(headerElt);
  headerElt.appendChild(pseudoElt);
  headerElt.appendChild(timeElt);
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
