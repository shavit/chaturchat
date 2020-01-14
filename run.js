const WebSocketClient = require('websocket').client;

/**
   Config
*/
const id = ''; // segment or room maybe
const streamId = '';
const url = `wss://STREAM_HOST.stream.highwebmedia.com/ws/${id}/${streamId}/websocket`;
const userName = ''; // must be changed
const roomName = ''; // must be set
const roomPassword = ''; // 64 characters
const sig = ''; // 64 characters
const expiration = 0;
const password = {
  username: userName,
  org: 'A',
  expire: expiration,
  sig,
  room: roomName,
};

const msgHello = {
  method: 'connect',
  data: {
    user: userName,
    password: JSON.stringify(password),
    room: roomName,
    room_password: roomPassword,
  },
};

const msgJoin = {
  method: 'joinRoom',
  data: {
    room: roomName,
  },
};

const sendMessage = (ws, m) => {
  let msg = JSON.stringify(m);
  msg = JSON.stringify([msg]);
  console.log('[run] Send message:', msg);
  ws.send(msg);
};

const handleMessage = (ws, m) => {
  if (!m.utf8Data) {
    console.warn('[run] Could not parse message:', m);
    return;
  }

  console.log('[run] New message', m.utfData, m);

  if (m.utf8Data[0] === 'a' && m.utf8Data.length > 3) {
    let msg = m.utf8Data.substring(3, m.utf8Data.length - 2);
    msg = JSON.parse(`"${msg}"`);
    msg = JSON.parse(msg);
    if (msg.method === 'onAuthResponse') {
      console.log('[run] Authenticated?', msg.args[0]);
      sendMessage(ws, msgJoin);
    }
  }
};

const wsClient = new WebSocketClient();

wsClient.on('connectFailed', (e) => {
  console.error('[run] Failed', e);
});

wsClient.on('connect', (ws) => {
  ws.on('error', (e) => {
    console.error('[run] Error:', e);
  });

  ws.on('close', () => {
    console.log('[run] Connection closed');
  });

  ws.on('message', (m) => {
    handleMessage(ws, m);
  });

  console.info('[run] Connected to:', url);
  // Send hello message
  sendMessage(ws, msgHello);
});

wsClient.connect(url);
