"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const kafkaInit_1 = __importDefault(require("./kafkaInit"));
class Producer {
    constructor() {
        console.log("Initializing Kafka producer...");
        this.producer = kafkaInit_1.default.producer();
        this.initialize();
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Connecting producer to Kafka...");
                yield this.producer.connect();
                console.log("Producer connected to Kafka!");
            }
            catch (error) {
                console.error("Error connecting to Kafka:", error);
            }
        });
    }
    SendMessage(topic, message) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Sending message to ${topic}: ${message}`);
            try {
                yield this.producer.send({
                    topic: topic,
                    messages: [{ key: "key", value: message }],
                });
                console.log(`Message sent to ${topic}`);
            }
            catch (error) {
                console.error("Error sending message:", error);
            }
        });
    }
}
exports.default = Producer;
