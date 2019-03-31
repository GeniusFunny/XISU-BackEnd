const query = require('../../util/query')
const sql = {
  find: `
    SELECT * from course
    WHERE courseId=?
  `,
  insert: `
    INSERT INTO course(courseId, term, kind, year, courseName)
      VALUES(?, ?, ?, ?, ?)
  `
}
async function find(courseId) {
  return await query(sql.find, [courseId])
}
async function course(courseId, term, kind, year, courseName) {
  let data = await find(courseId)
  if (!data.length) {
    return await query(sql.insert, [courseId, term, kind, year, courseName])
  }
}
exports.course = course
