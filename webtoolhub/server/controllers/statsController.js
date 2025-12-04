const Stat = require('../models/Stat');

// 获取系统统计数据
exports.getSystemStats = async (req, res) => {
  try {
    // 模拟数据，实际应用中从数据库获取
    const stats = {
      userCount: 12548,
      orderTotal: 856923,
      systemStatus: '正常',
      uptime: '246天',
      userGrowth: [1200, 1900, 3000, 5000, 8000, 12548],
      orderGrowth: [50000, 120000, 250000, 420000, 650000, 856923]
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取统计数据失败'
    });
  }
};

// 获取最近订单
exports.getRecentOrders = async (req, res) => {
  try {
    // 模拟订单数据
    const orders = [
      { id: 'ORD-2023-1245', customer: '张三', amount: 1299, status: 'completed' },
      { id: 'ORD-2023-1244', customer: '李四', amount: 899, status: 'processing' },
      { id: 'ORD-2023-1243', customer: '王五', amount: 2450, status: 'completed' },
      { id: 'ORD-2023-1242', customer: '赵六', amount: 599, status: 'cancelled' }
    ];
    
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取订单数据失败'
    });
  }
};