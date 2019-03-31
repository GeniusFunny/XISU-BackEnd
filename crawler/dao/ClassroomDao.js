const superAgent = require('superagent')
const cheerio = require('cheerio')
const fetchClassroom = require('./API_URL').fetchClassroom
const cookieDao = require('./CookieDao').CookieDao
const write = require('../cache/index').write

async function ClassroomDao(query, userId, cookie) {
  const field = `${query.cycleTime.dateBegin} ${query.timeBegin}-${query.timeEnd}`
  if (typeof cookie === 'undefined') {
    cookie = await cookieDao(userId)
    cookie = cookie[0].cookie
  }
  return await superAgent.post(fetchClassroom)
    .set('Cookie', cookie)
    .send(`classroom.type.id=&classroom.campus.id=&classroom.building.id=&seats=&classroom.name=&cycleTime.cycleCount=1&cycleTime.cycleType=1&cycleTime.dateBegin=${query.cycleTime.dateBegin}&cycleTime.dateEnd=${query.cycleTime.dateEnd}&roomApplyTimeType=1&timeBegin=${query.timeBegin}&timeEnd=${query.timeEnd}`)
    .then(res => {
      const $ = cheerio.load(res.text)
      let emptyClassroom = []
      try {
        $('tbody').children('tr').each((i, elem) => {
          emptyClassroom[i] = {
            date: query.cycleTime.dateBegin,
            time: `${query.timeBegin}~${query.timeEnd}`,
            roomName: $(elem).children()[1].firstChild.data.replace(/[\r\n\t]/g, ''),
            location: $(elem).children()[2].firstChild.data.replace(/[\r\n\t]/g, ''),
            type: $(elem).children()[4].firstChild.data.replace(/[\r\n\t]/g, ''),
            size: parseInt($(elem).children()[5].firstChild.data.replace(/[\r\n\t]/g, ''))
          }
        })
        setImmediate(async () => {
          await write('emptyClassroom', field, JSON.stringify(emptyClassroom))
        })
        return emptyClassroom
      } catch (e) {
        throw new Error(e)
      }
    })
}
exports.ClassroomDao = ClassroomDao
