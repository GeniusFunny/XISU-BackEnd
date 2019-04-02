const CourseTableDao = require('../db/CourseTableDao').fetchCourseTable
async function CourseTableService(userId) {
  try {
    let data = await CourseTableDao(userId)
    return {
      status: 0,
      message: 'SUCCESS',
      data: {
        items: data.map(item => ({
          ...item,
          plan: decodeURIComponent(item.plan)
        })),
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

exports.CourseTableService = CourseTableService
