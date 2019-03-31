const superAgent = require('superagent')
const cheerio = require('cheerio')
const cryptoJS = require('crypto-js')
const fetchLoginInfo = require('./API_URL').fetchLoginInfo
const login = require('./API_URL').login
const sleep = require('../../util/sleep').sleep
const recordLogin = require('../db/user').login

async function LoginDao(username, password) {
  let cookie = ''
  let computedPassword = ''
  await superAgent(fetchLoginInfo)
    .then(res => {
      cookie = res.headers['set-cookie'].join(',').match(/(JSESSIONID=.+?);/)[1]
      const $ = cheerio.load(res.text)
      let key = $('script').last().html().slice(246, 283)
      computedPassword = cryptoJS.enc.Hex.stringify(cryptoJS.SHA1(`${key}${password}`))
    })
    .catch(err => {
      throw new Error(err.message)
    })
  await sleep(500)
  return await superAgent
    .post(login)
    .set('Cookie', cookie)
    .type('form')
    .send({
      username: username,
      password: computedPassword,
      encodedPassword: '',
      session_locale: 'zh_CN'
    })
    .then(res => {
      if (res.text.indexOf('密码错误') !== -1 || res.text.indexOf('账户不存在') !== -1) {
        return {
          errMessage: '用户不存在或密码错误'
        }
      } else {
        // recordLogin(username, password, cookie)
        return {
          cookie: cookie
        }
      }
    })
    .catch(err => {
      throw new Error(err.message)
    })
}
exports.LoginDao = LoginDao
