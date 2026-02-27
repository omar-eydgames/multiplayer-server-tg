const WebSocket = require('ws');

const PORT = process.env.PORT || 3000;

const wss = new WebSocket.Server({
  port: PORT
});

let players = {};

wss.on('connection', function connection(ws) {

  const playerId = Date.now().toString();

  players[playerId] = {
    x: 0,
    y: 0,
    hp: 100,
    damage: 10
  };

  console.log(`Player conectado: ${playerId}`);

  ws.on('message', function incoming(message) {

    let data;

    try {
      data = JSON.parse(message);
    } catch (err) {
      console.log('Mensagem inválida');
      return;
    }

    // VERSÃO STANDARD (VULNERÁVEL)
    if (data.type === 'move') {
      players[playerId].x = data.x;
      players[playerId].y = data.y;
    }

    if (data.type === 'attack') {
      const target = data.targetId;

      if (players[target]) {
        // Evita que o cliente defina o dano
        players[target].hp -= players[playerId].damage;
      }
    }

    console.log(players);
  });

  ws.on('close', () => {
    delete players[playerId];
    console.log(`Player desconectado: ${playerId}`);
  });

});

console.log(`Servidor rodando na porta ${PORT}`);
