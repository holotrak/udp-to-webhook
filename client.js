const dgram = require('dgram');
const readline = require('readline');

const rl = readline.createInterface({
 input: process.stdin,
 output: process.stdout
});

const client = dgram.createSocket('udp4');

// Function to prompt for server details
function getServerDetails() {
 rl.question('Enter UDP server IP: ', (ip) => {
  rl.question('Enter UDP server port: ', (port) => {
   startClient(ip, parseInt(port));
  });
 });
}

function startClient(serverHost, serverPort) {
 client.on('message', (msg, rinfo) => {
  console.log(`Received message from ${rinfo.address}:${rinfo.port}: ${msg}`);
 });

 sendMessage(serverHost, serverPort);
}

function sendMessage(serverHost, serverPort) {
 rl.question('Enter message to send: ', (message) => {
  client.send(message, serverPort, serverHost, (error) => {
   if (error) {
    console.error(error);
   } else {
    console.log('Message sent');
    sendMessage(serverHost, serverPort); // Allow user to send another message
   }
  });
 });
}

getServerDetails();
