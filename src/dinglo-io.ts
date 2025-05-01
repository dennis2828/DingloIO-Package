import { io, Socket } from "socket.io-client";
import { nanoid } from "nanoid";

type MessagePayload = {
  message: any;
};

type MessageEventCallback = (...args: any[]) => void;

export default class DingloIO {
  private socket?: Socket;
  private storagePrefix = "DingloIO-";
  private apiKey: string;
  public chatId: string = "";
  public clientKey: string = "";

  constructor(api_key: string) {
    this.apiKey = api_key;
  }

  initializeSocket(): void {
    if (!this.socket) {
      if (!this.getFromLocalStorage(this.storagePrefix + "user")) {
        this.uniqueUser();
      }

      const connectionId = this.getFromLocalStorage(this.storagePrefix + "user") || "";
      this.socket = io("http://localhost:3001", {
        query: {
          apiKey: this.apiKey,
          connectionId: connectionId,
        },
      });
      this.chatId = connectionId;
    }
  }

  on(event: string, cb: MessageEventCallback): void {
    this.socket?.on(event, cb);
  }

  off(event: string): void {
    this.socket?.off(event);
  }

  respond(msg: MessagePayload): void {
    this.socket?.emit("message", { ...msg });
  }

  async save(newMessage: MessagePayload): Promise<any> {
    const res = await fetch(`http://localhost:3000/api/client/${this.chatId}`, {
      method: "POST",
      body: JSON.stringify({
        ...newMessage,
        messagedAt: new Date(Date.now()).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        apiKey: this.clientKey.trim() !== "" ? this.clientKey : this.apiKey,
      }),
    });
    return await res.json();
  }

  async getConversation(): Promise<any> {
    const res = await fetch(
      `http://localhost:3000/api/client/${this.chatId}?apiKey=${
        this.clientKey.trim() !== "" ? this.clientKey : this.apiKey
      }`
    );
    return await res.json();
  }

  async getQuestions(): Promise<any> {
    const res = await fetch(
      `http://localhost:3000/api/client/${this.chatId}/questions?apiKey=${
        this.clientKey.trim() !== "" ? this.clientKey : this.apiKey
      }`
    );
    return await res.json();
  }

  disconnectSocket(): void {
    this.socket?.disconnect();
  }

  getFromLocalStorage(key: string, parse?: boolean): string | null {
    const item = localStorage.getItem(key);
    if (!item) return null;
    return parse ? JSON.parse(item) : item;
  }

  private uniqueUser(): void {
    localStorage.setItem(this.storagePrefix + "user", nanoid());
  }
}
