'use strict'
const xml2js = require('xml2js');
const Promise = require('bluebird');
const tpl = require('./tpl');
exports.parseXMLAsync = function(xml) {
    return new Promise((resolve, reject) => {
        xml2js.parseString(xml, { trim: true }, (err, content) => {
            if (err) reject(err)
            else resolve(content)
        });
    });
};
function formatMsg(val) {
    const msg = {};
    Object.keys(val.xml).forEach(v => {
        msg[v] = val.xml[v][0];
    });
    return msg;
}
exports.formatMsg = formatMsg;
exports.tpl = function(content, msg) {
    const info = {};
    let type = 'text';
    if (Array.isArray(content)) {
        type = 'news';
    }
    type = content.type || type;
    info.content = content;
    info.createTime = new Date().getTime();
    info.msgType = type;
    info.fromUserName = msg.ToUserName;
    info.toUserName = msg.FromUserName;
    return tpl.compiled(info);
}