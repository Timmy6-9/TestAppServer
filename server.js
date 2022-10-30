import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 443, clientTracking: true })
const addressUserMap = new Map();


console.log(`Socket Server Started & Listening`)

// Remove ipv6 header if address is ipv4
function ipv4(address) {
  if(address.substring(0,7) == "::ffff:"){
    let newAddress = address.slice(7,20);
    return newAddress;
  }
  else{
    return address;
  }
};

wss.on('connection', function connection(ws, req) {
  ws.on('message', function message(data) {
    const msg = JSON.parse(data);
    let ip = ipv4(req.socket.remoteAddress);
    if(msg.type == 'message'){
      if(ip == addressUserMap.get(msg.user)){
        console.log(msg.user + ":" + msg.text);
        wss.clients.forEach(function each(client){
          client.send(msg.user + ": " + msg.text);
        });
      }
      else{
        console.log("User could not be authenticated.");
      }
    }
    else if(msg.type == 'username'){
      addressUserMap.set(msg.user, ip);
      console.log(addressUserMap);
    };
  });
});