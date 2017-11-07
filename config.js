'use strict'
const util = require('./libs/util');
const path = require('path');
const wechat_file = path.join(__dirname, 'config/wechat.txt');
const config = {
    wechat: {
        appID: 'wx19d81fb5c4103d7e',
        appSecret: 'ce0e7d84ea436b4fd980be2f23afb864',
        token: 'kjfnlvdklvldsvhalvbasl',
        getAccessToken() {
            return util.readFileAsync(wechat_file);
        },
        saveAccessToken(data) {
            data = JSON.stringify(data);
            return util.writeFileAsync(wechat_file, data);
        }
    }
};
module.exports = config;