const query = require('../util/db')
const sql = {
  insertCourseTable: `
    insert into courseTable(id, courseId)
      values(?, ?)
  `,
  insertCourseTask: `
    insert into courseTask(courseId, plan, classroom, courseName, teacher, id)
      values(?, ?, ?, ?, ?, ?)
  `,
  findCourseTable: `
    select * from courseTable
    where id = ? and courseId = ?
  `,
  findCourseTask: `
    select * from courseTask
    where courseId = ?
  `
}

async function findCourseTableDao(userId, courseId) {
  return await query(sql.findCourseTable, [userId, courseId])
}
async function findCourseTaskDao(courseId) {
  return await query(sql.findCourseTask, [courseId])
}
async function insertCourseTableDao(userId, courseId) {
  let data = await findCourseTableDao(userId, courseId)
  if (data.length === 0) {
    await query(sql.insertCourseTable, [userId, courseId])
  }
}
async function insertCourseTaskDao(courseId, plan, classroom, courseName, teacher, id) {
  let data = await findCourseTaskDao(courseId)
  if (data.length === 0) {
    await query(sql.insertCourseTask, [courseId, plan, classroom, courseName, teacher, id])
  }
}

exports.insertCourseTableDao = insertCourseTableDao
exports.insertCourseTaskDao = insertCourseTaskDao
