const next = require('next')
const bodyParser = require('koa-bodyparser')
const path = require('path')
const Router = require('koa-router')
const views = require('koa-views')
const Koa = require('koa')

const fetchEmptyClassroom = require('./server/controller/EmptyClassroomController')
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app
  .prepare()
  .then(() => {
    const port = process.env.PORT || 1338
    const server = new Koa()
    const router = new Router()
    server
      .use(bodyParser())
      .use(views(path.join(__dirname, './view'), {
        extension: 'pug'
      }))
      .use(router.routes())
      .use(router.allowedMethods())

    router
      .get('/classroom', async ctx => {
        const actualPage = '/'
        let data = await fetchEmptyClassroom()
        return app.render(ctx.req, ctx.res, actualPage, data)
      })
      .get('*', ctx => {
        return handle(ctx.req, ctx.res)
      })
    server.listen(port, () => {
      console.log('server is running!!!')
    })

  })
  .catch(ex => {
    console.error(ex.stack)
    process.exit(1)
  })
