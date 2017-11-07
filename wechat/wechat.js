'use strict'
import Promise from 'bluebird';
import fs from 'fs';
import _ from 'lodash';
import http from 'axios';
const request = Promise.promisify(require('request'));
import util from './util';

const prefix = 'https://api.weixin.qq.com/cgi-bin/';
const api = {
    accessToken: prefix + 'token?grant_type=client_credential',
    temporary: {
        upload: prefix + 'media/upload?'
    },
    permanent: {
        upload: prefix + 'media/add_material?',
        uploadnews: prefix + 'material/add_news?',
        uploadnewsPic: prefix + 'media/uploadimg?'
    },
    user: {
        userinfo: prefix + 'user/info'
    },
    menu: {
        creat: prefix + 'menu/create',
        get: prefix + 'menu/get',
        delete: prefix + 'menu/delete',
        current: prefix + 'get_current_selfmenu_info',
    },
    robot: 'http://op.juhe.cn/robot/index'
}
function Wechat(opts) {
    this.appID = opts.appID;
    this.appSecret = opts.appSecret;
    this.getAccessToken = opts.getAccessToken;
    this.saveAccessToken = opts.saveAccessToken;
    this.fetchAccessToken();
};
Wechat.prototype.fetchAccessToken = function(data) {
    if (this.access_token && this.expires_in && this.isValidAccessToken(data)) {
        return Promise.resolve(this);
    }
    return this.getAccessToken().then(data => {
            try {
                data = JSON.parse(data);
            }
            catch(e) {
                return this.updataAccessToken();
            }
            if (this.isValidAccessToken(data)) {
                return data;
            }
            else {
                return this.updataAccessToken(data);
            }
        }).then(res => {
            this.access_token = res.access_token;
            this.expires_in = res.expires_in;
            this.saveAccessToken(res);
            return Promise.resolve(res);
        })
}
Wechat.prototype.isValidAccessToken = function(data) {
    if (!data || !data.access_token || !data.expires_in) {
        return false;
    }
    const now = (new Date().getTime());
    if (now < data.expires_in) {
        return true;
    }
    else {
        return false;
    }
};
Wechat.prototype.updataAccessToken = function() {
    return new Promise((resolve, reject) => {
        http.get(api.accessToken, {
            params: {
                appid: this.appID,
                secret: this.appSecret
            }
        }).then(res => {
            const now = (new Date().getTime());
            res.data.expires_in = now + (res.data.expires_in - 20) * 1000;
            resolve(res.data);
        });
    });
}
Wechat.prototype.uploadMaterial = function(type, material, permanent) {
    let form = {};
    let uploadUrl = api.temporary.upload;
    if (permanent) {
        uploadUrl = api.permanent.upload;
    //     _.assign(form, permanent);
    }
    // if (type === 'pic') {
    //     uploadUrl = api.permanent.uploadnewsPic;
    // }
    // if (type === 'news') {
    //     uploadUrl = api.permanent.uploadnews;
    //     form = material;
    // }
    // else {
    form.media = fs.createReadStream(material);
    // }
    // const appID = this.appID;
    // const appSecret = this.appSecret;
    return new Promise((resolve, reject) => {
        this.fetchAccessToken().then(data => {
            let url = `${uploadUrl}access_token=${data.access_token}&type=${type}`;
            if (permanent) {
                form.access_token = data.access_token;
                form.type = type;
            }
            const options = {
                method: 'POST',
                url: url,
                json: true
            };
            // if (type === 'news') {
            //     options.body = form;
            // }
            // else {
            options.formData = form;
            // }
            request(options).then(function(res) {
                console.log(res.body);
                const _data = res.body;
                if (_data) {
                    resolve(_data);
                }
                else {
                    console.error('上传失败');
                }
            });
        }).catch(err => {
            reject(err);
        });
    });
}
Wechat.prototype.userInfo = function(openid, lang) {
    return new Promise((resolve, reject) => {
        this.fetchAccessToken().then(data => {
            http.get(api.user.userinfo, {
                params: {
                    access_token: data.access_token,
                    openid,
                    lang: lang ? lang : 'zh_CN'
                }
            }).then(res => {
                const data = res.data;
                if (data) {
                    resolve(data);
                }
                else {
                    console.error('获取用户信息失败');
                }
            });
        }).catch(err => {
            reject(err);
        });
    });
}
Wechat.prototype.createdMenu = function(menu) {
    return new Promise((resolve, reject) => {
        this.fetchAccessToken().then(data => {
            http.post(`${api.menu.creat}?access_token=${data.access_token}`, {
                ...menu
            }).then(res => {
                if (res.data.errcode === 0) {
                    resolve(data);
                }
                else {
                    console.error('创建菜单失败');
                }
            });
        }).catch(err => {
            reject(err);
        });
    });
}
Wechat.prototype.getMenu = function(menu) {
    return new Promise((resolve, reject) => {
        this.fetchAccessToken().then(data => {
            http.get(api.menu.get, {
                params: {
                    access_token: data.access_token
                }
            }).then(res => {
                const data = res.data;
                if (data) {
                    resolve(data);
                }
                else {
                    console.error('获取菜单失败');
                }
            });
        }).catch(err => {
            reject(err);
        });
    });
}
Wechat.prototype.deleteMenu = function() {
    return new Promise((resolve, reject) => {
        this.fetchAccessToken().then(data => {
            http.get(api.menu.delete, {
                params: {
                    access_token: data.access_token
                }
            }).then(res => {
                const data = res.data;
                if (data) {
                    resolve(data);
                }
                else {
                    console.error('删除菜单失败');
                }
            });
        }).catch(err => {
            reject(err);
        });
    });
}
Wechat.prototype.currentMenu = function() {
    return new Promise((resolve, reject) => {
        this.fetchAccessToken().then(data => {
            http.get(api.menu.current, {
                params: {
                    access_token: data.access_token
                }
            }).then(res => {
                const data = res.data;
                if (data) {
                    resolve(data);
                }
                else {
                    console.error('获取自定义配置菜单信息失败');
                }
            }); 
        }).catch(err => {
            reject(err);
        });
    });
}
Wechat.prototype.qaRobot = function(info) {
    return new Promise((resolve, reject) => {
        http.get(api.robot, {
            params: {
                info,
                key: 'ac63f2c467b12fe48098894cc131ac7f'
            }
        }).then(res => {
            const data = res.data;
            if (data) {
                resolve(data.result.text);
            }
            else {
                console.error('调用机器人失败');
            }
        });
    });
}
Wechat.prototype.reply = function(cxt) {
    const content = cxt.body;
    const msg = cxt.weixin;
    const xml = util.tpl(content, msg);
    cxt.status = 200;
    cxt.type = 'application/xml';
    cxt.body = xml;
}
module.exports = Wechat;
