const login = require('../service/LoginService').LoginService
const fetchClassroom = require('../service/ClassroomService').ClassroomService
const hold = require('../util/sleep').hold

async function fetchEmptyClassroom() {
  let date = new Date()
  date = `${date.getFullYear()}-${date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)}-${date.getDate() > 9 ? date.getDate() : '0' + date.getDate()}`
  let data = {
    cycleTime: {
      dateBegin: date,
      dateEnd: date,
      cycleCount: 1,
      cycleType: 1,
      roomApplyTimeType: 0
    },
    timeBegin: '14:00',
    timeEnd: '18:00'
  }
  let afternoon, night
  let userId = 107242016000003
  let res = await login(userId, userId)
  let cookie = res.data.cookie
  hold(400)
  afternoon = await fetchClassroom(data, userId, cookie)
  data.timeBegin = '18:30'
  data.timeEnd = '22:30'
  hold(400)
  night = await fetchClassroom(data, userId, cookie)
  return {
    afternoonItems: afternoon.data.items,
    nightItems: night.data.items,
    date: date
  }
}

module.exports = fetchEmptyClassroom
