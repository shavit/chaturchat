# Group Chat

> Read-only group chat

Usage
```
npm start
```

## Protocol

First you will need to establish a connection to the room. The variable names are just place holders, and they may have different meaning on the backend.
```
const id = '';
const streamId = '';
const url = `wss://chatws3.stream.highwebmedia.com/ws/{id}/{streamId}/websocket`;
```

1. Client sends a connect message with the user password
```
{
    method: 'connect',
    data: {
	user: '',
	password: JSON.stringify(password),
	room: '',
	room_password:  {
    		username: '',
        	org: 'A',
    	 	expire: 0,
        	sig: '',
    	 	room: ''
	}
    }
}
````

2. Server respond with `h`

3. Client sends a join message
```
{
   method: 'joinRoom',
   data: {
    	 room: roomName
    }
}

```

### Checks

From this point the client may or may not need to reply to server messages.

There are 2 messages that are being sent every n seconds:
1. Ping - May not be only through the browser, and unrelated to the websocket connection.
2. Room update - Updates the number of users in the room.

## Troubleshooting

Keep in mind this was just a POC

  * The user will get kicked out of the room if the client opens multiple connections
  * Every message is wrapped in an array, and every message is a string, so you'll need to jsonify nested objects
