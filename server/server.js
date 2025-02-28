const http = require("http");
const express = require("express");
const Websocket_Server = require("./dist/services/sockets");

const app = express();
const server = http.createServer(app);
app.get("/", (req, res) => {
    res.send("Hello World");
});
const wsServer = new Websocket_Server(server);
wsServer.initListner();

server.listen(8000, () => console.log("Server Started at port 8000"));
