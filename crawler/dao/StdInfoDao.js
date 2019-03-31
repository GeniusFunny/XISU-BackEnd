const superAgent = require('superagent')
const cheerio = require('cheerio')
const fetchInfo = require('./API_URL').fetchInfo
const fs = require('fs')

async function StdInfoDao(cookie) {
  return await superAgent.get(fetchInfo)
    .query('projectType=MAJOR')
    .set('Cookie', cookie)
    .then(res => {
      const $ = cheerio.load(res.text)
      if (res.text.indexOf('女') !== -1) {
        let phoneRegExp = new RegExp(/1[3578]\d{9}/, 'g')
        let phone = res.text.match(phoneRegExp)
        let name = ''
        if (phone !== null) {
          phone = phone.filter((item, index, array) => array.indexOf(item) === index && item !== '18465212171')
        }
        if (phone.length) {
          $('#photoImg').children('img').each((i, elem) => {
            name = $(elem).attr('title')
          })
          fs.appendFile('Contact.txt', `${phone.join(',')},`, err => {
            if (err) return
            console.log('写入')
          })
        }
      }
    })
    .catch(err => {
      console.log(err)
      throw new Error(err)
    })
}
exports.StdInfoDao = StdInfoDao
