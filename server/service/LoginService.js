const LoginDao = require('../../crawler/dao/LoginDao').LoginDao
async function LoginService(username, password) {
  try {
    let data = await LoginDao(username, password)
    return typeof data.errMessage !== 'undefined' ? {
      status: 1,
      data
    } : {
      status: 0,
      message: 'SUCCESS',
      data
    }
  } catch (e) {
    return {
      status: 1,
      message: 'FAILED'
    }
  }
}
exports.LoginService = LoginService
