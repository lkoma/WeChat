'use strict'
const ejs = require('ejs');
const heredoc = require('heredoc');

const tpl = heredoc(() => {/*
    <xml>
        <ToUserName><![CDATA[<%= toUserName %>]]></ToUserName>
        <FromUserName><![CDATA[<%= fromUserName %>]]></FromUserName>
        <CreateTime><%= createTime %></CreateTime>
        <MsgType><![CDATA[<%= msgType %>]]></MsgType>
        <% if (msgType === 'text') { %>
            <Content><![CDATA[<%= content %>]]></Content>
        <% } else if (msgType === 'image') { %>
            <Image>
                <MediaId><![CDATA[<%= content.mediaId %>]]></MediaId>
            </Image>
        <% } else if (msgType === 'voice') { %>
            <Voice>
                <MediaId><![CDATA[<%= content.mediaId %>]]></MediaId>
            </Voice>
        <% } else if (msgType === 'video') { %>
            <Video>
                <MediaId><![CDATA[<%= content.mediaId %>]]></MediaId>
                <Title><![CDATA[<%= content.title %>]]></Title>
                <Description><![CDATA[<%= content.description %>]]></Description>
            </Video> 
        <% } else if (msgType === 'music') { %>
            <Music>
                <Title><![CDATA[<%= content.title %>]]></Title>
                <Description><![CDATA[<%= content.description %>]]></Description>
                <MusicUrl><![CDATA[<%= content.musicUrl %>]]></MusicUrl>
                <HQMusicUrl><![CDATA[<%= content.hqMusicUrl  %>]]></HQMusicUrl>
                <ThumbMediaId><![CDATA[<%= content.ThumbMediaId %>]]></ThumbMediaId>
            </Music>
        <% } else if (msgType === 'news') { %>
            <ArticleCount><%= content.length %></ArticleCount>
            <Articles>
            <% content.forEach(item => { %>
                <item>
                    <Title><![CDATA[<%= item.title %>]]></Title> 
                    <Description><![CDATA[<%= item.description %>]]></Description>
                    <PicUrl><![CDATA[<%= item.picUrl %>]]></PicUrl>
                    <Url><![CDATA[<%= item.url %>]]></Url>
                </item>
            <% }) %>
            </Articles>
        <% } %>
    </xml>
*/});
const compiled = ejs.compile(tpl);

exports = module.exports = {
    compiled
};


// ejs(template)({a: true})

// <% if(a) {%>
// <p>123</p>
// <% } %>
// function render(data) {
//     with(data) {
// [text(''), `if(a){`, text('<p>123</p>'), `}`]
// var html ="";
// function text(str) {
//     html+=str;
// }

// eval(`html = text('');if(a){text('<p>123</p>')}`)
//     }

// }

// function compile(template) {
//     [text(''), `if(a){`, text('<p>123</p>'), `}`]
//     var html ="";
//     function text(str) {
//         html+=str;
//     }
//     const string = `html = text('');if(a){text('<p>123</p>')}`;
//     return function(data) {
//         let html = "";
//         with(data) {
//             eval(string);
//         }
//         return html;
//     }
// }