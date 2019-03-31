const bodyParser = require('koa-bodyparser')
const Koa = require('koa')
const views = require('koa-views')
const Router = require('koa-router')
const child_process = require('child_process')
const path = require('path')
const port = process.env.PORT || 1338
const app = new Koa()
const router = new Router()
const login = require('./service/LoginService').LoginService
const fetchScore = require('./service/ScoreService').ScoreService
const fetchClassroom = require('./service/ClassroomService').ClassroomService
const fetchCourseTable = require('./service/CourseTableService').CourseTableService
const fetchEmptyClassroom = require('./controller/EmptyClassroomController')
const fetchStdInfo = require('./service/StdInfoService').StdInfoService

app
  .use(bodyParser())
  .use(views(path.join(__dirname, './view'), {
    extension: 'pug'
  }))
  .use(router.routes())
  .use(router.allowedMethods())
  .use(async (ctx, next) => {
    if (ctx.request.url .indexOf('api') === -1) {
      await next()
    } else {
      if (ctx.header.cookie) {
        let cookies = ctx.header.cookie
        cookies = cookies.split(';')
        ctx.request.userId = decodeURIComponent(cookies[0].split('=')[1])
        await next()
      } else if(ctx.url.indexOf('login') !== -1) {
        await next()
      } else {
        ctx.status = 401
        ctx.body = '401'
      }
    }
  })

router
  .post('/api/login', async ctx => {
    let data = ctx.request.body
    ctx.body = await login(data.username, data.password)
    if (ctx.body.status === 0) {
      child_process.fork('./crawler/index.js', [data.username])
      ctx.cookies.set('cid',
        `${encodeURIComponent(data.username)}`
      )
    }
  })
  .get('/login', async ctx => {
    await ctx.render('login')
  })
  .get('/api/user', async () => {
    let data = await fetchStdInfo('')
  })
  .post('/login', async ctx => {
    let user = ctx.request.body
    let res = await login(user.username, user.password)
    if (res.status === 0) {
      let data = await fetchEmptyClassroom()
      await ctx.render('emptyClassroom', {
        ...data
      })
    } else {
      let error = {
        title: '登陆失败',
        content: res.errMessage
      }
      await ctx.render('error', {
        error
      })
    }
  })
  .get('/api/score', async ctx => {
    ctx.body = await fetchScore(ctx.request.userId)
  })
  .post('/api/classroom', async ctx => {
    let data = ctx.request.body
    ctx.body = await fetchClassroom(data, ctx.request.userId)
  })
  .get('/api/courseTable', async ctx => {
    ctx.body = await fetchCourseTable(ctx.request.userId)
  })
  .get('/api/emptyClassroom', async ctx => {
    ctx.body = await fetchEmptyClassroom()
  })
  .get('/', async ctx => {
    let data = await fetchEmptyClassroom()
    await ctx.render('emptyClassroom', {
      ...data
    })
  })
app.listen(port, () => {
  console.log('server is running!!!')
})
