var express = require('express')
var superagent = require('superagent')
var cheerio = require('cheerio')
var eventproxy = require('eventproxy')
var url = require('url');
var app = express()
var cnodeUrl = 'https://cnodejs.org/'
app.get('/', function (req,res){
    superagent.get(cnodeUrl).end(function(error, resp){
        if(error) {
            console.log(error)
        }
        var $ = cheerio.load(resp.text)
        var topicUrls = []
        $('.cell .topic_title').each(function(i,ele){
            var $ele = $(ele)
            var handleUrl = url.resolve(cnodeUrl, $ele.attr('href'))
            topicUrls.push(handleUrl)
        })
        // 得到 topicUrls 之后

        // 得到一个 eventproxy 的实例
        var ep = new eventproxy();
        var topicArr = []
        ep.after('topic_html', topicUrls.length,function(arr) {
           arr.forEach(function(e){
               var $ = cheerio.load(e[1])
               var content = $('.reply_content').eq(0).text().trim()
               var url = e[0]
            topicArr.push({
                title: $('.topic_full_title').text().trim(),
                content: content,
                url: url,
            })
           })
            res.send(topicArr)
        })
        topicUrls.forEach(function (topicUrl) {
            superagent.get(topicUrl)
              .end(function (err, res) {
                console.log('fetch ' + topicUrl + '    successful')
                ep.emit('topic_html', [topicUrl, res.text])
              })
        })
    })
})

app.listen('1024',function(){
    console.log('111')
})