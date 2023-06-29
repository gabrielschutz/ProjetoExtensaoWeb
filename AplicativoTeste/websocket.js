const WebSocket = require('ws');
const { updateStatus } = require('./StatusLora');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {

  console.log('OI');

  ws.send(JSON.stringify(updateStatus()));

  setInterval(() => {
    const updatedStatus = updateStatus();
    ws.send(JSON.stringify(updatedStatus));
    console.log('Status atualizado:', updatedStatus);
  }, 5000);


  ws.on('close', () => {
    console.log('Conexão WebSocket fechada');
  });

});
