const query = require('../../util/query')

const sql = {
  register: `
    INSERT INTO user(id, password, cookie)
      VALUES(?, ?, ?)
  `,
  update: `
    UPDATE user SET password=?, cookie=?
    WHERE id=?
  `,
  find: `
    SELECT * from user
    WHERE id=?
  `,
  all: `
    SELECT id, password FROM user
  `
}

async function register(id, password, cookie) {
  try {
    return await query(sql.register, [id, password, cookie])
  } catch (e) {
    throw new Error('已经注册')
  }
}
async function find(id) {
  return await query(sql.find, [id])
}
async function update(password, cookie, id) {
  return await query(sql.update, [password, cookie, id])
}
async function login(id, password, cookie) {
  let data = await find(id)
  if (data.length) {
    await update(password, cookie, id)
  } else {
    await register(id, password, cookie)
  }
}
async function userList() {
  return await query(sql.all)
}

exports.login = login
exports.userList = userList
