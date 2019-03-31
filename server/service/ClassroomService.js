const ClassroomDao = require('../../crawler/dao/ClassroomDao').ClassroomDao
const read = require('../../crawler/cache/index').read

async function ClassroomService(data, userId, cookie) {
  const field = `${data.cycleTime.dateBegin} ${data.timeBegin}-${data.timeEnd}`
  try {
    let res = await read('emptyClassroom', field)
    res = JSON.parse(res)
    if (res === null || res.length === 0) {
      res = await ClassroomDao(data, userId, cookie)
      return {
        status: 0,
        message: 'SUCCESS',
        data: {
          items: res,
          length: res.length
        }
      }
    } else {
      return {
        status: 0,
        message: 'SUCCESS',
        data: {
          items: res,
          length: res.length
        }
      }
    }
  } catch (e) {
    return {
      status: 1,
      message: 'FAILED'
    }
  }
}

exports.ClassroomService = ClassroomService
