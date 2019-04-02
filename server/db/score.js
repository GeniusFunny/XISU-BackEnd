const query = require('../util/db')
const sql = {
  find: `
    SELECT * from courseScore
    WHERE courseId=? AND id=?
  `,
  insert: `
    INSERT INTO courseScore(courseId, id, score)
      VALUES(?, ?, ?)
  `,
  update: `
    UPDATE courseScore SET score=?
    WHERE courseId=? AND id=?
  `
}
async function find(courseId, userId) {
  return await query(sql.find, [courseId, userId])
}
async function score(userId, courseId, score) {
  let data = await find(courseId, userId)
  if (data.length) {
    return await query(sql.update, [score, courseId, userId])
  } else {
    return await query(sql.insert, [courseId, userId, score])
  }
}
exports.score = score
