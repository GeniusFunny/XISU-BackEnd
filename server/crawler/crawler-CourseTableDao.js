const superAgent = require('superagent')
const cheerio = require('cheerio')
const fetchCourseTable = require('../constants/API_URL').fetchCourseTable
const fetchCourseTask = require('../constants/API_URL').fetchCourseTask
const fetchCourseTableId = require('../constants/API_URL').fetchCourseTableId
const cookieDao = require('../db/CookieDao').CookieDao
const sleep = require('../util/sleep').sleep
const recordCourseTable = require('../db/courseTable').insertCourseTableDao
const recordCourseTask = require('../db/courseTable').insertCourseTaskDao
async function CourseTaskDao(cookie, task) {
  return await superAgent.get(fetchCourseTask)
    .query(`lesson.id=${task.courseId}`)
    .set('Cookie', cookie)
    .then(res => {
      const $ = cheerio.load(res.text)
      try {
        let sourceStr = $('script').last().html().toString().replace(/[\r\n\t]/, '')
        let data = sourceStr.match(/(activity = new TaskActivity[\s\S]*assistantName,"","")/g).map(item => item.split('\n')[0]).map(item => item.slice(77, -1).split(','))[0]
        let planArray = data[4].slice(1, 21).split('')
        let classroom = data[3].slice(1, -1)
        let start = 0
        let end = 0
        let plan = ''
        for (let i = 0; i < 20; i++) {
          if (start === 0 && parseInt(planArray[i]) === 1) {
            start = i
            plan += start
          } else if (start !== 0 && parseInt(planArray[i]) === 0) {
            end = i - 1
            if (end === start) {
              plan += ','
            } else {
              plan += '-' + end + ','
            }
            start = 0
          }
        }
        setImmediate(async () => {
          await recordCourseTask(task.courseId, encodeURIComponent(plan.slice(0, -1)), classroom, task.courseName, task.teacher, task.id)
        })
      } catch (e) {
        console.log(e)
        throw new Error(e)
      }
    })
    .catch(err => {
      throw new Error(err)
    })
}
async function CourseTableIdDao(cookie) {
  return await superAgent.get(fetchCourseTableId).set('Cookie', cookie)
    .then(res => {
      const $ = cheerio.load(res.text)
      try {
        let sourceStr = $('script').last().html().toString().replace(/[\r\n\t]/, '')
        return sourceStr.match(/"ids"[\s\S]*\);/g)[0].split(')')[0].split(',')[1].slice(1, -1)
      } catch (e) {
        throw new Error(e)
      }
    })
}
async function CrawlerCourseTableDao(userId) {
  let cookie = await cookieDao(userId)
  cookie = cookie[0].cookie
  let courseTable = []
  let id = await CourseTableIdDao(cookie)
  return await superAgent.post(fetchCourseTable)
    .send(`ignoreHead=1&setting.kind=std&startWeek=&semester.id=11&ids=${id}`)
    .set('Cookie', cookie)
    .then(res => {
      const $ = cheerio.load(res.text)
      try {
        $('#grid12042826911_data').children('tr').each((i, elem) => {
          courseTable[i] = {
            id: $(elem).children()[1].firstChild.data.replace(/[\r\n\t]/g, ''),
            courseName: $(elem).children()[2].firstChild.data.replace(/[\r\n\t]/g, ''),
            teacher: $(elem).children()[5].firstChild.data.replace(/[\r\n\t]/g, ''),
            courseId: $($(elem).children()[4].firstChild).next().attr('href').split('=')[1]
          }
        })
        courseTable.forEach(async item => {
          await recordCourseTable(userId, item.courseId)
        })
        return courseTable
      } catch (e) {
        throw new Error(e)
      }
    })
    .then(async data => {
      for (let i = 0; i < data.length; i++) {
        await sleep(500)
        await CourseTaskDao(cookie, data[i])
      }
    })
}
exports.CourseTableDao = CrawlerCourseTableDao
exports.CourseTaskDao = CourseTaskDao
