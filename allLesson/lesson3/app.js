var express = require('express')
var superagent = require('superagent')
var cheerio = require('cheerio')


var app = express()

app.get('/', function(req,res) {
	superagent.get('https://cnodejs.org/')
	.end(function(error,res2){
		// res.send(res2.text)
		      // 常规的错误处理
      if (error) {
        return next(error);
      }
      // sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
      // 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
      // 剩下就都是 jquery 的内容了
		var $ = cheerio.load(res2.text)
		var list = []
		var linkList = $('.cell').each(function(o,el){
			var $ele = $(el)
			var $topic_title = $ele.find('.topic_title')
			var $img = $ele.find('.user_avatar img')
			list.push({
				title: $topic_title.attr('title'),
				herf: $topic_title.attr('href'),
				user: $img.attr('title'),
			})
		})
		
		res.send(list)
	})
	
})

app.listen('1024',function(req,res){
	console.log('1024')
})