const query = require('../../util/query')

const sql = {
  find: `
    select year, courseScore.courseId, term, courseName, kind, score from courseScore inner join course on courseScore.courseId = course.courseId
    where courseScore.id = ?
    `
}

async function findScoreDao(userId) {
  try {
    return await query(sql.find, [userId])
  } catch (e) {
    throw new Error(e)
  }
}
exports.findScoreDao = findScoreDao
