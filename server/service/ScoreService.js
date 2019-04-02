const ScoreDao = require('../db/ScoreDao').findScoreDao
async function ScoreService(userId) {
  try {
    let data = await ScoreDao(userId)
    return {
      status: 0,
      message: 'SUCCESS',
      data: {
        items: data,
        length: data.length
      }
    }
  } catch (e) {
    return {
      status: 1,
      message: 'FAILED'
    }
  }
}

exports.ScoreService = ScoreService
