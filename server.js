// Based on https://line.github.io/line-bot-sdk-nodejs/getting-started/basic-usage.html#synopsis
// 做了一些修改讓同學們比較好理解

const express = require("express");
const line = require("@line/bot-sdk");
const app = express();
const port = 3000;
require("dotenv").config();
const config = {
  channelAccessToken: process.env.YOUR_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.YOUR_CHANNEL_SECRET,
};

const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: config.channelAccessToken,
});

app.get("/", (req, res) => {
  res.send(`Hi ${req.query.name}!`);
});

app.post("/webhook", line.middleware(config), (req, res) => {
  // req.body.events 可能有很多個
  for (const event of req.body.events) {
    handleEvent(event);
  }

  // 回傳一個 OK 給呼叫的 server，這邊應該是回什麼都可以
  res.send("OK");
});

function handleEvent(event) {
  // 如果不是文字訊息，就跳出
  if (event.type !== "message" || event.message.type !== "text") {
    return;
  }

  // 回覆一模一樣的訊息，多一個驚嘆號
  client.replyMessage({
    replyToken: event.replyToken,
    messages: [
      {
        type: "text",
        text: `${event.message.text}dddd!`,
      },
    ],
  });
}

app.listen(port, () => {
  console.log(`Sample LINE bot server listening on port ${port}...`);
});
