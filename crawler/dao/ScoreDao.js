const superAgent = require('superagent')
const cheerio = require('cheerio')
const fetchScore = require('./API_URL').fetchScore
const recordCourse = require('../db/course').course
const recordScore = require('../db/score').score

async function ScoreDao(cookie, userId) {
  return await superAgent.get(fetchScore)
    .query('projectType=MAJOR')
    .set('Cookie', cookie)
    .then(res => {
      const $ = cheerio.load(res.text)
      let course = []
      try {
        $('#grid21344342991_data').children('tr').each((i, elem) => {
          if (typeof $(elem).children()[0] !== 'undefined') {
            let term = $(elem).children()[0].firstChild.data.replace(/[\r\n\t]/g, '')
            let length = $(elem).children().length
            course[i] = {
              term: term.split(' ')[1],
              id: term + $(elem).children()[1].firstChild.data.replace(/[\r\n\t]/g, ''),
              kind: $(elem).children()[4].firstChild.data.replace(/[\r\n\t]/g, ''),
              className: $(elem).children()[3].firstChild.data.replace(/[\r\n\t]/g, ''),
              score: $(elem).children()[length - 2].firstChild.data.replace(/[\r\n\t]/g, ''),
              gpa: $(elem).children()[length - 1].firstChild.data.replace(/[\r\n\t]/g, ''),
              year: term.split(' ')[0],
            }
          }
        })
        course.forEach(async item => {
          try {
            await recordCourse(item.id, item.term, item.kind, item.year, item.className)
            await recordScore(userId, item.id, item.score)
          } catch (e) {
            throw new Error(e)
          }
        })
        return course.reverse()
      } catch (e) {
        console.log(e)
        throw new Error(e)
      }
    })
    .catch(err => {
      console.log(err)
      throw new Error(err)
    })
}
exports.ScoreDao = ScoreDao
