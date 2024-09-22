import Koa from 'koa'
const app = new Koa()

import json from 'koa-json' // 把参数转为 json 对象
import onerror from 'koa-onerror' // 错误监听
import bodyparser from 'koa-bodyparser' // 把前端传过来的请求参数转换
import logger from 'koa-logger' // 日志
import Router from 'koa-router'
import index from './routes/index.js'
import users from './routes/users.js'

const router = new Router()

// error handler
onerror(app) // 错误监测

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
router.use(index.routes()).use(index.allowedMethods())
router.use(users.routes()).use(users.allowedMethods())
app.use(router.routes()).use(router.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

export default app