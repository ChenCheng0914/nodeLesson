var express = require('express')
var superagent = require('superagent')
var cheerio = require('cheerio')
var eventproxy = require('eventproxy')
var async = require('async')
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
        async.mapLimit(topicUrls, 5, function(url, callback) {
            superagent.get(url).then((data) => {
                const $ = cheerio.load(data.text)
                var content = $('.reply_content').eq(0).text().trim()
                console.log('content', content)
                callback(error, {
                    url: url,
                    content: content,
                })
            })
        }, function(error, resList) {
            res.send(resList)
        })
    })
})

app.listen('1024',function(){
    console.log('111')
})