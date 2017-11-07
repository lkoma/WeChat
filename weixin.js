'use strict'
const config = require('./config');
const Wechat = require('./wechat/wechat');
const wechatApi = new Wechat(config.wechat);

exports.reply = async function (cxt, next) {
    const msg = cxt.weixin;
    if (msg.MsgType === 'event') {
        if (msg.Event === 'subscribe') {
            if (msg.EventKey) {
                console.log('微信扫码进来的' + msg.EventKey + '  ' + msg.ticket);
            }
            cxt.body = '订阅了此号';
        }
        else if (msg.Event === 'unsubscribe') {
            console.log('取消关注');
            cxt.body = '';
        }
        else if(msg.Event === 'LOCATION') {
            cxt.body = `您的位置是： 纬度(${msg.Latitude})经度(${msg.Longitude})精度(${msg.Precision})`;
        }
        else if (msg.Event === 'SCAN') {
            cxt.body = `已关注的事件推送，key值为： ${msg.EventKey},二维码的ticket为： ${msg.ticket}`;
        }
        else if (msg.Event === 'CLICK') {
            cxt.body = `点击菜单事件key值为： ${msg.EventKey}`;
        }
        else if (msg.Event === 'VIEW') {
            cxt.body = `点击菜单跳转链接时的事件key值为： ${msg.EventKey}`;
        }
    }
    else if (msg.MsgType === 'text') {
        const data = await wechatApi.qaRobot(msg.Content);
        cxt.body = data;
        if (msg.Content === '山鬼') {
            cxt.body = '若有人兮山之阿，被薜荔兮带女萝。';
        }
        if (msg.Content === '来点硬的') {
            cxt.body = [
                {
                    title: '我觉的还可以',
                    description: '我觉的不行',
                    picUrl: 'http://oj1dfv10p.bkt.clouddn.com/demo.jpg',
                    url: 'http://m2.thedoc.cn/matrix/homepage.html#/'
                }
            ]
        }
        if (msg.Content === '图片呢') {
            const data = await wechatApi.uploadMaterial('image', __dirname + '/image/timg.jpeg');
            cxt.body = {
                type: 'image',
                mediaId: data.media_id
            }
        }
        if (msg.Content === '视频呢') {
            const data = await wechatApi.uploadMaterial('video', __dirname + '/image/demo.mp4');
            cxt.body = {
                type: 'video',
                mediaId: data.media_id,
                description: '蓝色火麒麟，嘟嘟嘟。。。',
                title: '这个视频就是厉害'
            }
        }
        if (msg.Content === '音乐呢') {
            const data = await wechatApi.uploadMaterial('image', __dirname + '/image/timg.jpeg');
            cxt.body = {
                type: 'music',
                ThumbMediaId: data.media_id,
                description: '蓝色火麒麟，嘟嘟嘟。。。',
                title: '这个音乐就是厉害',
                musicUrl: 'http://oj1dfv10p.bkt.clouddn.com/siqingaoli.mp3'
            }
        }
        if (msg.Content === '永久图片') {
            const data = await wechatApi.uploadMaterial('image', __dirname + '/image/timg.jpeg', { type: 'image' });
            cxt.body = {
                type: 'image',
                mediaId: data.media_id
            }
            console.log(cxt.body);
        }
        if (msg.Content === '永久视频') {
            const data = await wechatApi.uploadMaterial('video', __dirname + '/image/demo.mp4', { type: 'video', description: '{"title": "我的视频", "introduction": "这个很厉害"}' });
            consoe.log(`${data}111111111111111`);
            cxt.body = {
                type: 'video',
                mediaId: data.media_id,
                description: '蓝色火麒麟，嘟嘟嘟。。。',
                title: '这个视频就是厉害'
            }
        }
        if (msg.Content === '我是谁') {
            const data = await wechatApi.userInfo(msg.FromUserName);
            cxt.body = `你是：${data.nickname}    家住：${data.province}${data.city}`;
        }
    }
    await next();
}