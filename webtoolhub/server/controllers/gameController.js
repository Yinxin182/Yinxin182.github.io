const GameRecord = require('../models/GameRecord');

// 保存游戏记录
exports.saveGameRecord = async (req, res) => {
  const { gameType, score, username } = req.body;
  
  try {
    const record = await GameRecord.create({
      gameType,
      score,
      username,
      playedAt: new Date()
    });
    
    res.json({
      success: true,
      data: record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '保存游戏记录失败'
    });
  }
};

// 获取游戏排行榜
exports.getGameRankings = async (req, res) => {
  const { gameType } = req.params;
  
  try {
    const rankings = await GameRecord.find({ gameType })
      .sort({ score: -1 })
      .limit(10)
      .select('username score playedAt');
    
    res.json({
      success: true,
      data: rankings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取排行榜失败'
    });
  }
};