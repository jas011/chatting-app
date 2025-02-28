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
class Consumer {
    constructor(topic) {
        this.consumer = kafkaInit_1.default.consumer({ groupId: 'chat-group' });
        console.log("Connecting consumer to Kafka...");
        this.consumer.connect();
        console.log("Consumer connected to Kafka!");
        this.consumer.subscribe({ topic: topic, fromBeginning: true });
    }
    MessageConsumer() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.consumer.run({
                eachMessage: (_a) => __awaiter(this, [_a], void 0, function* ({ topic, partition, message, heartbeat, pause }) {
                    console.log(`'chat-group': [${topic}]: PART:${partition}:`, message.value.toString());
                }),
            });
        });
    }
}
const consumer = new Consumer("GroupChat");
consumer.MessageConsumer();
exports.default = Consumer;
