const http = require('http');
const Index = require('ws');

const server = http.createServer(async (req, res) => {
  res.end('ok');
});
const wss = new Index.Server({ server });

// это вариант с библиотекой io 
// const app = require('express')();
// const http = require('http').Server(app);
// const io = require('socket.io')(http);
// const port = process.env.PORT || 8282;

// app.get('/', (req, res) => {
//     res.end('ok');
// });

const connections = new Map();

wss.on('connection', (socket) => {
  connections.set(socket, {});

  socket.on('message', (messageData) => {
    const message = JSON.parse(messageData);
    let excludeItself = false;

    if (message.type === 'hello') {
      excludeItself = true;
      connections.get(socket).userName = message.data.name;
      sendMessageTo(
        {
          type: 'user-list',
          data: [...connections.values()].map((item) => item.userName).filter(Boolean),
        },
        socket
      );
    }

    sendMessageFrom(connections, message, socket, excludeItself);
  });

  socket.on('close', () => {
    sendMessageFrom(connections, { type: 'bye-bye' }, socket);
    connections.delete(socket);
  });
});

function sendMessageTo(message, to) {
  to.send(JSON.stringify(message));
}

function sendMessageFrom(connections, message, from, excludeSelf) {
  const socketData = connections.get(from);

  if (!socketData) {
    return;
  }

  message.from = socketData.userName;

  for (const connection of connections.keys()) {
    if (connection === from && excludeSelf) {
      continue;
    }

    connection.send(JSON.stringify(message));
  }
}

server.listen(8282);
// http.listen(port, () => {
//     console.log(`Socket.IO server running at http://localhost:${port}/`);
// });