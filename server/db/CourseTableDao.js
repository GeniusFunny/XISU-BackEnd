const query = require('../util/db')
const sql = {
  find: `
    select * from courseTable inner join courseTask on courseTable.courseId = courseTask.courseId
    where courseTable.id = ?
  `
}

async function fetchCourseTable(userId) {
  return await query(sql.find, [userId])
}

exports.fetchCourseTable = fetchCourseTable
