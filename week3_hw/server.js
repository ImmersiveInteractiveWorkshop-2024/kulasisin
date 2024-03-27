// Based on https://line.github.io/line-bot-sdk-nodejs/getting-started/basic-usage.html#synopsis
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
const articles = {
  life: [
    {
      id: 0,
      title: "雨天散步小提醒",
      link: "https://www.goodmeat.com.tw/pages/cute-1",
      type: "image",
      originalContentUrl: "https://i.imgur.com/nFZAaVg.png",
      previewImageUrl: "https://i.imgur.com/nFZAaVg.png",
    },
    {
      id: 1,
      title: "夏日防護小提醒",
      link: "https://www.goodmeat.com.tw/pages/cute-9",
      originalContentUrl: "https://i.imgur.com/52cE2Kf.png",
      previewImageUrl: "https://i.imgur.com/52cE2Kf.png",
    },
    {
      id: 2,
      title: "台灣狗狗圖鑑",
      link: "https://www.goodmeat.com.tw/pages/cute-2",
      originalContentUrl: "https://i.imgur.com/NuLFQsH.png",
      previewImageUrl: "https://i.imgur.com/NuLFQsH.png",
    },
  ],
  funfact: [
    {
      id: 0,
      title: "狗狗也有小心機",
      link: "https://www.goodmeat.com.tw/pages/cute-3",
      originalContentUrl: "https://i.imgur.com/4p9NJl5.png",
      previewImageUrl: "https://i.imgur.com/4p9NJl5.png",
    },
    {
      id: 1,
      title: "狗狗是渣男剋星",
      link: "https://www.goodmeat.com.tw/pages/cute-4",
      originalContentUrl: "https://i.imgur.com/Cs9kRa6.png",
      previewImageUrl: "https://i.imgur.com/Cs9kRa6.png",
    },
    {
      id: 2,
      title: "狗狗也能當演員",
      link: "https://www.goodmeat.com.tw/pages/cute-5",
      originalContentUrl: "https://i.imgur.com/VnpztEY.png",
      previewImageUrl: "https://i.imgur.com/VnpztEY.png",
    },
    {
      id: 3,
      title: "狗狗也會唱金曲",
      link: "https://www.goodmeat.com.tw/pages/cute-7",
      originalContentUrl: "https://i.imgur.com/QXp7UOC.png",
      previewImageUrl: "https://i.imgur.com/QXp7UOC.png",
    },
  ],
  health: [
    {
      id: 0,
      title: "狗狗也怕熱衰竭",
      link: "https://www.goodmeat.com.tw/pages/cute-6",
      originalContentUrl: "https://i.imgur.com/gI2lk0z.png",
      previewImageUrl: "https://i.imgur.com/gI2lk0z.png",
    },
    {
      id: 1,
      title: "狗狗也要防曬嗎?",
      link: "https://www.goodmeat.com.tw/pages/cute-8",
      originalContentUrl: "https://i.imgur.com/IfesS0d.png",
      previewImageUrl: "https://i.imgur.com/IfesS0d.png",
    },
    {
      id: 2,
      title: "狗狗血液大哉問",
      link: "https://www.goodmeat.com.tw/pages/cute-10",
      originalContentUrl: "https://i.imgur.com/HrP2UIk.png",
      previewImageUrl: "https://i.imgur.com/HrP2UIk.png",
    },
  ],
  else: [
    {
      id: 0,
      text: `快選啦拜託拜託拜託~`,
    },
    {
      id: 1,
      text: `你難道不想更了解可愛的狗狗嗎？快來看喔～(日常／有趣／健康)`,
    },
    {
      id: 2,
      text: `挖藍天白雲爺，來看專欄吧!(日常／有趣／健康)`,
    },
    {
      id: 3,
      text: `你!就差你沒有看過好肉專欄惹，快來吧！(日常／有趣／健康)`,
    },
    {
      id: 4,
      text: `生活專欄是關於狗生的生活，爽(日常／有趣／健康)`,
    },
    {
      id: 5,
      text: `請選擇ㄟ謝謝你！(日常／有趣／健康)`,
    },
    {
      id: 6,
      text: `請乖乖選擇類別~(日常／有趣／健康)`,
    },
    {
      id: 7,
      text: `你好棒喔！(日常／有趣／健康)`,
    },
    {
      id: 8,
      text: `蛤！真的不選喔~(日常／有趣／健康)`,
    },
  ],
};

const getArticle = (category) => {
  let randomNum = parseInt(Math.random() * articles[category].length);
  return articles[category][randomNum];
};

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

let currentIndex = 0;
async function handleEvent(event) {
  if (event.type !== "message" || event.message.type !== "text") {
    return;
  }
  // console.log(event);
  if (event.message.text === "開始" || currentIndex === 0) {
    client.replyMessage({
      replyToken: event.replyToken,
      messages: [
        {
          type: "text",
          text: `您好，歡迎來到好肉小教室專欄，您需要甚麼呢？我們提供日常/有趣/健康三個類別的知識專欄呦$～`,
          emojis: [
            {
              index: 44,
              productId: "5ac21184040ab15980c9b43a",
              emojiId: "015",
            },
          ],
        },
      ],
    });
    currentIndex++;
    return;
  } else if (event.message.text.includes("日常")) {
    const article = getArticle("life");
    await client.replyMessage({
      replyToken: event.replyToken,

      messages: [
        {
          type: "text",
          text: ` 您選擇了日常類別的專欄!為您特別推薦【${article.title}】：`,
          quoteToken: event.message.quoteToken,
        },
        {
          type: "image",
          originalContentUrl: article.originalContentUrl,
          previewImageUrl: article.previewImageUrl,
        },
        {
          type: "text",
          text: ` 點我看更多：${article.link}`,
        },
        {
          type: "text",
          text: ` 還有更多專欄可以閱讀~請選擇專欄類別：日常／有趣／健康`,
        },
      ],
    });
    return;
  } else if (event.message.text.includes("有趣")) {
    const article = getArticle("funfact");
    await client.replyMessage({
      replyToken: event.replyToken,

      messages: [
        {
          type: "text",
          text: ` 您選擇了有趣類別的專欄!為您特別推薦【${article.title}】：`,
          quoteToken: event.message.quoteToken,
        },
        {
          type: "image",
          originalContentUrl: article.originalContentUrl,
          previewImageUrl: article.previewImageUrl,
        },
        {
          type: "text",
          text: ` 點我看更多：${article.link}`,
        },
        {
          type: "text",
          text: ` 還有更多專欄可以閱讀~請選擇專欄類別：日常／有趣／健康`,
        },
      ],
    });
    return;
  } else if (event.message.text.includes("健康")) {
    const article = getArticle("health");
    await client.replyMessage({
      replyToken: event.replyToken,

      messages: [
        {
          type: "text",
          text: ` 您選擇了健康類別的專欄!為您特別推薦【${article.title}】：`,
          quoteToken: event.message.quoteToken,
        },
        {
          type: "image",
          originalContentUrl: article.originalContentUrl,
          previewImageUrl: article.previewImageUrl,
        },
        {
          type: "text",
          text: ` 點我看更多：${article.link}`,
        },
        {
          type: "text",
          text: ` 還有更多專欄可以閱讀~請選擇專欄類別：日常／有趣／健康`,
        },
      ],
    });

    return;
  } else {
    const article = getArticle("else");
    await client.replyMessage({
      replyToken: event.replyToken,
      messages: [
        {
          type: "text",
          text: `${article.text}`,
          quoteToken: event.message.quoteToken,
        },
      ],
    });
    return;
  }
}

app.listen(port, () => {
  console.log(`Sample LINE bot server listening on port ${port}...`);
});
