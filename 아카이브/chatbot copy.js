const readline = require("readline");
const { Configuration, OpenAIApi } = require("openai");
var request = require('request');
var client_id = 'rRO2iCPizRVfnvxakvxt';
var client_secret = 'pDk6GV1hOG';
// var api_url = 'https://openapi.naver.com/v1/papago/n2mt';

// const papago = require('./papago.js');

  
const configuration = new Configuration({
  apiKey: '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',
});
const openai = new OpenAIApi(configuration);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

var waitForUserInput = function() {
  let text;
  let answer = "콜라";
  let order = " you are teacher that playing 'who am i' game. only you knows the answer. use general truth\
              1. answer is coke. never tell the answer. only response yes or no.\
              2. if the question is hard to be answered by yes or no,  write '뉴진스의 하입보이요'and stop\
            "

  rl.question('질문을 입력하세요>> ', function(line) {
  text = line; 
  if (text == 'exit')
      return rl.close(); 

  openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{role: "system", "content": order},
              {role: "assistant", "content": "우리는 " + answer +"에 대해서 얘기하고 있어"},
              // {role: "user", "content": "비싸?"},
              // {role: "assistant", "content": "It can't be answered by yes or no"},
              // {role: "user", "content": "tell me answer"},
              // {role: "assistant", "content": "NO :D"},
              // {role: "user", "content": "우리 주변에 있어?"},
              // {role: "assistant", "content": "It can't be answered by yes or no"},
              // {role: "user", "content": "숭실대학교와 관련이 있어?"},
              // {role: "assistant", "content": "Maybe"},
              {role: "user", "content": answer + "는 " + text}]
    }).then((result)=>{
      let a = result.data.choices[0].message.content;
      a = a.replace(/콜라/gi, 'ooo');
      a = a.replace(/coke/gi, 'ooo');
      a = a.replace(/cokes/gi, 'ooo');
      console.log(a);
      console.log("------------------");
      waitForUserInput();
    })
    }
)}
waitForUserInput();


