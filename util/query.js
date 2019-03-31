const mysql = require('mysql')
const pool = mysql.createPool({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '19980812',
  database: 'xisu'
})
function query(sql, values) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err)
      } else {
        connection.query(sql, values, (err, rows) => {
          connection.release()
          if (err) {
            reject(err)
          } else {
            resolve(rows)
          }
        })
      }
    })
  })
}
module.exports = query
