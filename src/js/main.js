// var socket = io.connect('http://localhost:8080/'); //Once on the server, should be set to http://yourdomain.com:8080/
var socket = io.connect('/'); //Once on the server, should be set to http://yourdomain.com:8080/

var espaceConnexionElt = document.getElementById('espaceConnexion');
var espaceChatElt = document.getElementById('espaceChat');
var conversationElt = document.getElementById('conversation');
var utilisateursConnectesElt = document.getElementById('utilisateursConnectes');
var pseudoInput = document.getElementById('nouveauPseudo');
var connecterElt = document.getElementById('connecter');
var pseudo = '';

// Enable Connect button if nouveauPseudo is filled
pseudoInput.addEventListener('keyup', function() {
  if(WEE.Dom.getInputValue('nouveauPseudo') !== '') {
    connecterElt.disabled = false;
  } else {
    connecterElt.disabled = true;
  }
});

// We send a message to server when we click on the button 'connecter'
connecterElt.addEventListener('click', function () {
  if(WEE.Dom.getInputValue('nouveauPseudo') !== ''){
    // Send the pseudo to the server
    pseudo = WEE.Dom.getInputValue('nouveauPseudo');
    socket.emit('pseudoConnecte', pseudo);
    // Handle sections visibility
    espaceConnexionElt.setAttribute('hidden', true);
    espaceChatElt.style.visibility = 'visible';
    WEE.Dom.focusOn('nouveauMessage');
  }
});

// We send a message to server when we click on the button 'envoyer'
document.getElementById('envoyer').addEventListener('click', function () {
    var now = new Date();
    var msg = WEE.Dom.getInputValue('nouveauMessage');
    // Send to server: {nouveauMessage, pseudo, time, recipient}
    if (msg !== '') {
      socket.emit('messageClient', {content: msg, author: pseudo, time: now.toTimeString().substring(0,8), recipient: 'everyone'});
      WEE.Dom.clearInputValue('nouveauMessage');
    }
});

// When we get a messageServeur, we add the message to the client page
socket.on('messageServeur', function(message) {
  addMessage(message);
});

// When we get a sound from the server, we play 'data'.mp3 and display an information
socket.on('son', function(data) {
  play(data.son, this);
  conversationElt.setAttribute('class', 'col-12 wizz');
  setTimeout(function() {
    conversationElt.setAttribute('class', 'col-12');
  }, 2000);
});
socket.on('messageSon', function(message) {
  addInfo(message);
});

// When we get a messageNouvelleConnexion, we add an connection information to the client page
socket.on('messageNouvelleConnexion', function(message){
  addInfo(message);
});

// When someone connects, we display the login into 'connected users' box
// We add 3 buttons to send private messages and sounds
 socket.on('messageListeUtilisateurs', function(users){

   var userClass = 'user pull-right mr-2';
   var iClass = '';
   utilisateursConnectesElt.innerHTML = '';
   // WEE.Dom.addHTMLElement(utilisateursConnectesElt, 'span', {content: 'Chat App'});
   users.user.forEach(function(user) {
     if(user.pseudo === pseudo) {
       userClass = 'btn user user-light disabled';
       iClass='';
     } else {
       userClass = 'btn user user-dark';
       iClass = 'fa fa-music ml-1';
     }
     var liElt = WEE.Dom.addHTMLElement(utilisateursConnectesElt, 'li', {class: 'nav-item'});
     var loggedUser = WEE.Dom.addHTMLElement(liElt, 'button', {id: 'mouette_' + user.id, content: user.pseudo, class: userClass});
     WEE.Dom.addHTMLElement(loggedUser, 'i', {class: iClass});

     // Click on the logged user button and send him a private sound (mouette)
     document.getElementById('mouette_' + user.id).addEventListener('click', function () {
       if(user.pseudo !== pseudo) {
         socket.emit('boutonSon', {son: 'mouette', recipient: user.pseudo, recipientId: user.id});
       }
     });

   });
   WEE.Dom.addHTMLElement(utilisateursConnectesElt, 'hr');
 });

// When someone disconnects, we display an information on the client page
socket.on('messageDeconnexion', function(message){
  addInfo(message);
});

// addMessage function takes an object with properties 'author' and 'content' as parameter
// addMessage function add a new line with author and message in conversationElt div
function addMessage(message) {

  var msgClass = 'msg';
  if(message.author === pseudo) {
    msgClass = 'msg msg-light offset-2';
  } else {
    msgClass = 'msg msg-dark';
  }

  // Container for the new message line //
  var lineElt = WEE.Dom.addHTMLElement(conversationElt, 'div', {class: msgClass});
  var headerElt = WEE.Dom.addHTMLElement(lineElt, 'div');

  // Message elements //
  // Pseudo
  WEE.Dom.addHTMLElement(headerElt, 'span', {content: message.author, class: 'bold'});
  // Time
  WEE.Dom.addHTMLElement(headerElt, 'small', {content: message.time, class: 'pull-right'});
  // Message Content
  WEE.Dom.addHTMLElement(lineElt, 'div', {content: message.content});

  // Scrolls down automatically
  conversationElt.scrollTop = conversationElt.scrollHeight;

}

// addInfo function takes a string as parameter
// addInfo function add a new line with the new connected login in conversationElt div
function addInfo(message){
  WEE.Dom.addHTMLElement(conversationElt, 'div', {content: message, class: 'bold row mb-2 ml-1'});
  conversationElt.scrollTop = conversationElt.scrollHeight;
}

// Play a sound
function play(idPlayer, control) {
  var player = document.querySelector('#' + idPlayer);
  player.play();
}

// OLD
// // When we get a messagePriveServeur, we add the message to the client page
// socket.on('messagePriveServeur', function(message) {
//   addMessage(message);
// });

// OLD
//   users.user.forEach(function(user) {
//     // Message button
//     WEE.Dom.addHTMLElement(userElt, 'button', {id: user.id, class: 'btn btn-primary btn-sm glyphicon glyphicon-comment'});
//     // Click on the message button next to an user and send him a private message
//     document.getElementById(user.id).addEventListener('click', function (){
//       var now = new Date();
//       var msg = WEE.Dom.getInputValue('nouveauMessage');
//       if (msg !== '') {
//         socket.emit('messagePriveClient', {id: user.id, message: {content: msg, author: pseudo, time: now.toTimeString(), recipient: user.pseudo}});
//         WEE.Dom.clearInputValue('nouveauMessage');
//       }
//     });
//   });
