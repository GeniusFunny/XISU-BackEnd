const query = require('../util/db')

const sql = {
  find: `
    select cookie from user
    where id=?
  `
}

async function CookieDao(userId) {
  return await query(sql.find, [userId])
}

exports.CookieDao = CookieDao
