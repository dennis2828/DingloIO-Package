var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { io } from "socket.io-client";
import { nanoid } from "nanoid";
export default class DingloIO {
    constructor(api_key) {
        this.storagePrefix = "DingloIO-";
        this.chatId = "";
        this.clientKey = "";
        this.apiKey = api_key;
    }
    initializeSocket() {
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
    on(event, cb) {
        var _a;
        (_a = this.socket) === null || _a === void 0 ? void 0 : _a.on(event, cb);
    }
    off(event) {
        var _a;
        (_a = this.socket) === null || _a === void 0 ? void 0 : _a.off(event);
    }
    respond(msg) {
        var _a;
        (_a = this.socket) === null || _a === void 0 ? void 0 : _a.emit("message", Object.assign({}, msg));
    }
    save(newMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield fetch(`http://localhost:3000/api/client/${this.chatId}`, {
                method: "POST",
                body: JSON.stringify(Object.assign(Object.assign({}, newMessage), { messagedAt: new Date(Date.now()).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                    }), apiKey: this.clientKey.trim() !== "" ? this.clientKey : this.apiKey })),
            });
            return yield res.json();
        });
    }
    getConversation() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield fetch(`http://localhost:3000/api/client/${this.chatId}?apiKey=${this.clientKey.trim() !== "" ? this.clientKey : this.apiKey}`);
            return yield res.json();
        });
    }
    getQuestions() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield fetch(`http://localhost:3000/api/client/${this.chatId}/questions?apiKey=${this.clientKey.trim() !== "" ? this.clientKey : this.apiKey}`);
            return yield res.json();
        });
    }
    disconnectSocket() {
        var _a;
        (_a = this.socket) === null || _a === void 0 ? void 0 : _a.disconnect();
    }
    getFromLocalStorage(key, parse) {
        const item = localStorage.getItem(key);
        if (!item)
            return null;
        return parse ? JSON.parse(item) : item;
    }
    uniqueUser() {
        localStorage.setItem(this.storagePrefix + "user", nanoid());
    }
}
