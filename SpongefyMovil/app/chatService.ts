import { socketService } from './socketService';

class ChatService {
  sendMessage(nombre_usuario_envia: string, nombre_usuario_recibe: string, mensaje: string) {
    const socket = socketService.getSocket();
    socket.emit('sendMessage', {
      nombre_usuario_envia,
      nombre_usuario_recibe,
      mensaje,
    });
  }

  deleteMessage(id_mensaje: number) {
    const socket = socketService.getSocket();
    socket.emit('deleteMessage', {
      id_mensaje,
    });
  }

  onNewMessage(callback: (message: { from: string; to: string; content: string }) => void) {
    const socket = socketService.getSocket();
    socket.on('newMessage', callback);
  }

  onMessageDeleted(callback: (data: { id_mensaje: number }) => void) {
    const socket = socketService.getSocket();
    socket.on('messageDeleted', callback);
  }

  onMessageSent(callback: (data: { to: string; content: string }) => void) {
    const socket = socketService.getSocket();
    socket.on('messageSent', callback);
  }

  offEvents() {
    const socket = socketService.getSocket();
    socket.off('newMessage');
    socket.off('messageDeleted');
    socket.off('messageSent');
  }
}

export const chatService = new ChatService();
