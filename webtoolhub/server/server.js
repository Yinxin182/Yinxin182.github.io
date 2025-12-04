require('dotenv').config();
const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

// 设置Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:8000",
    methods: ["GET", "POST"]
  }
});

// 串口连接的Socket处理
io.on('connection', (socket) => {
  logger.info(`客户端已连接: ${socket.id}`);
  
  socket.on('serial-connect', (config) => {
    socket.emit('serial-status', { status: 'connecting', port: config.port });
  });
  
  socket.on('serial-send', (data) => {
    socket.emit('serial-receive', { 
      data: `响应: ${data}`, 
      timestamp: new Date().toLocaleString() 
    });
  });
  
  socket.on('disconnect', () => {
    logger.info(`客户端已断开连接: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  logger.info(`服务器运行在端口 ${PORT}`);
});