import { io, Socket } from 'socket.io-client';
import { useRouter } from "expo-router";

class SocketService {
  private socket: Socket;
  private username: string | null = null;
  private router = useRouter();

  constructor() {
    this.socket = io('https://spongefy-back-end.onrender.com', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket conectado:', this.socket.id);
      if (this.username) {
        this.login(this.username);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('🔌 Socket desconectado');
    });

    this.socket.on('forceLogout', () => {
      console.warn('⚠️ Has sido desconectado por login en otro dispositivo');
      this.socket.disconnect();
      this.reconnect();
      this.router.push('./LoginScreen');
    });
  }

  login(username: string) {
    this.username = username;
    this.socket.emit('login', username);
  }

  getSocket(): Socket {
    return this.socket;
  }

  reconnect() {
    this.socket.connect();
    console.log('Intentando reconectar el socket');
  }
}

export const socketService = new SocketService();
