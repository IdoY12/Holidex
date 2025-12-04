"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const config_1 = __importDefault(require("config"));
const server = new socket_io_1.Server({
    cors: {
        origin: '*'
    }
});
server.on('connection', socket => {
    console.log('client connected...');
    socket.onAny((eventName, payload) => {
        console.log(`received event ${eventName} with payload:`, payload);
        server.emit(eventName, payload);
    });
    socket.on('disconnect', () => console.log('client disconnected...'));
});
server.listen(config_1.default.get('port'));
console.log(`server started on port ${config_1.default.get('port')}`);
