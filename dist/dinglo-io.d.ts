type MessagePayload = {
    message: any;
};
type MessageEventCallback = (...args: any[]) => void;
export default class DingloIO {
    private socket?;
    private storagePrefix;
    private apiKey;
    chatId: string;
    clientKey: string;
    constructor(api_key: string);
    initializeSocket(): void;
    on(event: string, cb: MessageEventCallback): void;
    off(event: string): void;
    respond(msg: MessagePayload): void;
    save(newMessage: MessagePayload): Promise<any>;
    getConversation(): Promise<any>;
    getQuestions(): Promise<any>;
    disconnectSocket(): void;
    getFromLocalStorage(key: string, parse?: boolean): string | null;
    private uniqueUser;
}
export {};
