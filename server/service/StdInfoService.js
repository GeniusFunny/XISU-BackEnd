const StdInfoDao = require('../../crawler/dao/StdInfoDao').StdInfoDao

async function StdInfoService(cookie) {

  try {
    let data = await StdInfoDao(cookie)
    return {
      status: 0,
      message: 'SUCCESS',
      data: {}
    }
  } catch (e) {
    return {
      status: 1,
      message: 'FAILED'
    }
  }
}

exports.StdInfoService = StdInfoService
