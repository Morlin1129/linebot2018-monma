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
  var recipes = [{
    title : "目玉焼き",
    syokuzai:[
      {
        material : "卵",
        amount :"一個"
      },
      {
       material :"油",
       amount :"大さじ1"
     },
      {
       material :"愛情",
       amount :"多め"
     },
     ],
  tukurikata : "いためる",
  yosan :"5000兆円"
},
{
title : "料理の名前",
syokuzai:[
  {
    material : "食材A",
    amount :"大さじ1"
  },
  {
   material :"食材2",
   amount :"大さじ1"
 },
  {
   material :"食材3",
   amount :"大さじ1"
 },
 ],
tukurikata : "いためる",
yosan :"5000兆円"
}
];

  if(text.match(/こんにちは|こんにちわ|今日は/)){
    message = 'こんにちは!';
    var now = new Date();
    now.setTime(now.getTime() + 1000*60*60*9);
    var hour = now.getHours();
    message += "今は" + hour + "時です";
  } else if(text.match(/こんばんは|こんばんわ/)){
    message ='こんばんは！'
  } else if (text.match(/レシピ/))　{
  message = 'とりあえずまずは一つ目のレシピを出してみます\n';

  var sercMaterial = text.split('レシピ')[0].trim();
  var filteredRecipes = recipes.filter(function(v){
    for(var i=0;i< v.syokuzai.length;i++){
      if(sercMaterial.indexOf(v.syokuzai[0].material)>=0){
        return true;
    }
  }
  return false;
});
var recipe;
if(filteredRecipes.length){
  recipe= filteredRecipes[0];
  message+= 'こちらのレシピが見つかりました。';
}else{
  message = 'お探しの食材のレシピが見つかりませんでした';
  return message;
}

  //var recipe = recipes[0];
  message += "---" + "\n";
  message += recipe.title +"\n";
  message += recipe.yosan +"\n";
  message += "◇材料◇"　+"\n";
  for(var i=0;i <  recipe.syokuzai.length;i++) {
     message += "." + recipe.syokuzai[i].material + "--" +recipe.syokuzai[i].amount +"\n";
   }
   message += recipe.tukurikata + "\n";

 }else{

    message='まだあいさつくらいしか返せません・・・';
  }
  return message;
}
