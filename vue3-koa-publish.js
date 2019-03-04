const Koa = require('koa');
const cors = require('@koa/cors');
const serve = require('koa-static');
const send = require('koa-send');

const app = new Koa();
var bodyParser = require('koa-bodyparser');
app.use(
  bodyParser({
    formLimit: '10mb',
    jsonLimit: '10mb',
    textLimit: '10mb'
  })
);
app.use(serve('dist'));
app.use(cors());
app.use(async (ctx, next) => {
  await send(ctx, './dist/index.html');
});
app.listen(5010);
