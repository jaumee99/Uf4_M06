const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*'
  }
});

const MAX_PLAYERS = 2;
let connectedPlayers = 0;
let soldierPositions = [];

io.on('connection', (socket) => {
  if (connectedPlayers >= MAX_PLAYERS) {
    socket.emit('connection_error', 'Maximum number of players reached');
    socket.disconnect(true);
    return;
  }

  connectedPlayers++;

  socket.on('disconnect', () => {
    connectedPlayers--;
  });

  console.log('A player has connected');

  // Envia les posicions dels soldats als clients
  socket.emit('soldier_positions', soldierPositions);
  // Envia les posicions actualitzades als altres clients
  socket.broadcast.emit('soldier_positions', soldierPositions);

  socket.on('message', (data) => {
    try {
      const jsonData = JSON.parse(data);
      console.log(`Received message from player: ${jsonData}`);
      const response = { status: 'success', message: 'Mensaje recibido correctamente' };
      socket.emit('message_response', JSON.stringify(response));
    } catch (error) {
      console.error('Error al analizar el mensaje JSON:', error);
    }
  });
  
});

const port = 3000;
server.listen(port, () => {
  console.log(`Fixer server is running on port ${port}`);
});
