// expressを読み込み
var express = require("express");
var app = express();

app.set('view engine', 'ejs');

// サーバーの設定
var server = app.listen(process.env.PORT || 5000);

app.get("/", function(req, res, next){ //追加
  res.render('index.ejs', {text: 'こんにちは'}); //追加
}); //追加

app.get("/hello", function(req, res, next){
  var message = 'こんにちは'; //追加
  message = getMessageText(req.query.text);
  res.json(message); //'こんばんは'をmessageに書き換え
});

//今後LINEに接続するときに使います
const line = require('@line/bot-sdk');
const config = {
  channelAccessToken: 'vfmWUMdysdM3XMeEx1FXhLnRswFehOWobRillTY1gdU9hL2Fd63BMvtoKzzaD5SalJNE4W7Zs6zfACFXTIIEXyyo5ICSmUi3jg/TyGHaQRpz/Tz4O1xLqUc+PnlXcUbSwV74t9blK4Y6fu9DpSyhCgdB04t89/1O/w1cDnyilFU=',
  channelSecret: 'd206373e1a4940c5409ba0a8b962bbd7'
};

app.post('/line', line.middleware(config), function(req, res) {
  Promise
  .all(req.body.events.map(handleEvent))
  .then(function(result) {
    res.json(result)
  });
});

const client = new line.Client(config);
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }
  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: getMessageText(event.message.text)
  });
}

//ここまでLINEに接続するコード

//まずはここを触っていきます。
function getMessageText(text) {
  var message;
  if(text.match(/こんにちは|こんにちわ|今日は/)){
    message = 'こんにちは!';
    var now = new Date();
    var hour = now.getHours();
    message += "今は" + hour + "時です";
  } else if(text.match(/こんばんは|こんばんわ/)){
    message ='こんばんは！'
  } else {
    message='まだあいさつくらいしか返せません・・・';
  }
  return message;
}
