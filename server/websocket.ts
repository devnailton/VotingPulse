import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { Vote } from '@shared/schema';

export interface WebSocketMessage {
  type: 'new_vote' | 'get_votes' | 'votes_list';
  data?: any;
}

export function setupWebSocketServer(server: Server) {
  const wss = new WebSocketServer({ server, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    
    ws.on('message', (message) => {
      try {
        const parsedMessage = JSON.parse(message.toString()) as WebSocketMessage;
        handleMessage(parsedMessage, ws, wss);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
    
    // Send initial connection confirmation
    ws.send(JSON.stringify({ type: 'connected', data: { message: 'Connected to voting system websocket server' } }));
  });
  
  return wss;
}

function handleMessage(message: WebSocketMessage, ws: WebSocket, wss: WebSocketServer) {
  switch (message.type) {
    case 'new_vote':
      // Broadcast the new vote to all connected clients
      broadcastMessage(wss, {
        type: 'new_vote',
        data: message.data
      });
      break;
      
    default:
      console.log(`Unhandled message type: ${message.type}`);
  }
}

export function broadcastMessage(wss: WebSocketServer, message: WebSocketMessage) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}
