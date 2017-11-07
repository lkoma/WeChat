'use strict'
const koa = require('koa');
const path = require('path');
const wechat = require('./wechat/g');
const util = require('./libs/util');
const config = require('./config');
const Wechat = require('./wechat/wechat');
const weixin = require('./weixin');
const wechatApi = new Wechat(config.wechat);
const menu = require('./wx/menu');
const wechat_file = path.join(__dirname, 'config/wechat.txt');

const app = new koa();

wechatApi.deleteMenu().then(() => {
    wechatApi.createdMenu(menu);
});
app.use(wechat(config.wechat, weixin.reply));
app.listen(80);
console.log('listen:80');
