const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const SerialLog = require('../models/SerialLog');
const logger = require('../utils/logger');

// 获取可用串口列表
exports.getAvailablePorts = async (req, res) => {
  try {
    const ports = await SerialPort.list();
    res.json({
      success: true,
      data: ports.map(port => ({
        path: port.path,
        manufacturer: port.manufacturer,
        pnpId: port.pnpId
      }))
    });
  } catch (error) {
    logger.error('获取串口列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取串口列表失败'
    });
  }
};

// 连接串口
exports.connectSerial = async (req, res) => {
  const { port, baudRate = 115200, dataBits = 8, stopBits = 1, parity = 'none' } = req.body;
  
  try {
    // 在实际应用中这里会处理真实的串口连接
    const connectionInfo = {
      port,
      baudRate,
      connected: true,
      timestamp: new Date()
    };
    
    // 记录日志
    await SerialLog.create({
      port,
      action: 'connect',
      status: 'success'
    });
    
    res.json({
      success: true,
      data: connectionInfo
    });
  } catch (error) {
    await SerialLog.create({
      port,
      action: 'connect',
      status: 'failed',
      error: error.message
    });
    
    res.status(500).json({
      success: false,
      message: '串口连接失败'
    });
  }
};

// 发送数据
exports.sendData = async (req, res) => {
  const { port, data } = req.body;
  
  try {
    // 在实际应用中这里会发送真实数据到串口
    const responseData = `模拟响应: ${data}`;
    
    // 记录日志
    await SerialLog.create({
      port,
      action: 'send',
      data,
      response: responseData,
      status: 'success'
    });
    
    res.json({
      success: true,
      data: {
        sent: data,
        received: responseData,
        timestamp: new Date().toLocaleString()
      }
    });
  } catch (error) {
    await SerialLog.create({
      port,
      action: 'send',
      data,
      status: 'failed',
      error: error.message
    });
    
    res.status(500).json({
      success: false,
      message: '发送数据失败'
    });
  }
};

// 获取串口日志
exports.getSerialLogs = async (req, res) => {
  try {
    const logs = await SerialLog.find()
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json({
      success: true,
      data: logs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取日志失败'
    });
  }
};