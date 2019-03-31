const child_process = require('child_process')
const fetchUsers = require('./db/user').userList

async function main() {
  let userList = await fetchUsers()
  let i = 0
  let length = userList.length
  let timer = setInterval(() => {
    for (let j = 0; j < 5; j++) {
      if (i < length) {
        child_process.fork('./index.js', [userList[i].id, userList[i].password])
      } else {
        clearInterval(timer)
      }
      i++
    }
  }, 10000)
}

setImmediate(async () => {
  await main()
})
