// Based on https://line.github.io/line-bot-sdk-nodejs/getting-started/basic-usage.html#synopsis
// 做了一些修改讓同學們比較好理解

const express = require("express");
const dayjs = require("dayjs");
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
const timeQuestions = [
  "你最喜歡星期幾？",
  "現在是幾點？",
  "你什麼時候最有空？",
  "第一次喝酒是什麼時候？",
  "上次回家是什麼時候？",
  "你通常什麼時候吃早餐？",
  "上次去露營是時候？",
  "你計劃何時開始新的專案？",
  "你的生日是哪一天？",
  "你打算什麼時候去旅行？",
];
const locQuestions = [
  "你住在哪裡？",
  "你最喜歡去哪裡放鬆？",
  "你的工作地點在哪裡？",
  "你最近去過哪些有趣的地方？",
  "你通常在哪裡購物？",
  "你想和朋友見面的地方是哪裡？",
  "你最喜歡的餐廳在哪裡？",
  "你最喜歡的度假勝地是哪裡？",
  "你最常去的休閒場所是哪裡？",
  "你最喜歡的城市是哪一個？",
];

const adjQuestions = [
  "你最喜歡的顏色是什麼？",
  "你認為自己最大的優點是什麼？",
  "你的心情如何？",
  "你認為這個計劃有多重要？",
  "你最喜歡的季節如何？",
  "你認為英雄電影如何？",
  "你最近看到的風景如何？",
  "你想買的新衣服長怎麼樣？",
  "你認為這個問題困難嗎？",
  "你的理想工作怎麼樣？",
];

const nounQuestions = [
  "你最喜歡的食物是什麼？",
  "你的工作內容是什麼？",
  "你最喜歡的運動是什麼？",
  "你想學習的新事物是什麼？",
  "你喜歡狗還是貓?",
  "你最近讀的一本書是什麼？",
  "你隨意朋友的綽號是什麼？",
  "你最喜歡的動物是什麼？",
  "你愛吃的夜市小吃是甚麼？",
  "你最喜歡的娛樂活動是什麼？",
];

const advQuestions = [
  "你最近怎麼樣？",
  "你通常怎麼度過週末？",
  "你的工作進展如何？",
  "你今天早上起床時感覺如何？",
  "你通常如何處理壓力？",
  "你聽到鄰居夜晚吵鬧會多生氣？",
  "你最近多常運動？",
  "你跑得快還是慢？",
  "你多常思考未來？",
  "你多常在晚上看書？",
];

const getQuest = (questions) => {
  let randomNum = parseInt(Math.random() * questions.length);
  return questions[randomNum];
};

//時間設置

const getTime = () => {
  const now = dayjs();
  let time = {
    year: now.$y,
    month: now.$W,
    day: now.$D,
  };
  return time;
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

let currentQuestionIndex = 0;
let answers = {};

async function handleEvent(event) {
  // 如果不是文字訊息，就跳出

  if (event.type !== "message" || event.message.type !== "text") {
    return;
  }
  console.log(event);
  if (event.message.text === "開始" || currentQuestionIndex === 0) {
    currentQuestionIndex = 0;
    const time = getTime();

    client.replyMessage({
      replyToken: event.replyToken,
      messages: [
        {
          type: "text",
          text: ` 現在是${time.year}年${time.month}月${time.day}日，歡迎來到故事小舖，你的名字是甚麼呢？`,
        },
      ],
    });
    currentQuestionIndex++;

    return;
  } else if (currentQuestionIndex === 1) {
    answers.userName = event.message.text;
    const timeQuestion = getQuest(timeQuestions);
    await client.replyMessage({
      replyToken: event.replyToken,
      messages: [
        {
          type: "text",
          text: ` 你好${event.message.text}!請坐穩、深呼吸然後準備回答問題~\n${timeQuestion}`,
          quoteToken: event.message.quoteToken,
        },
      ],
    });

    currentQuestionIndex++;
    return;
  } else if (currentQuestionIndex === 2) {
    answers.userTime = event.message.text;
    const locQuestion = getQuest(locQuestions);
    await client.replyMessage({
      replyToken: event.replyToken,
      messages: [
        {
          type: "text",
          text: ` 很棒的開始爺！來~~\n${locQuestion}`,
        },
      ],
    });

    currentQuestionIndex++;
    return;
  } else if (currentQuestionIndex === 3) {
    answers.userLoc = event.message.text;
    const nounQuestion = getQuest(nounQuestions);
    await client.replyMessage({
      replyToken: event.replyToken,
      messages: [
        {
          type: "text",
          text: ` 原來如此壓！下個問題~\n${nounQuestion}`,
        },
      ],
    });

    currentQuestionIndex++;
    return;
  } else if (currentQuestionIndex === 4) {
    answers.userNoun = event.message.text;
    const adjQuestion = getQuest(adjQuestions);
    await client.replyMessage({
      replyToken: event.replyToken,
      messages: [
        {
          type: "text",
          text: ` 你回答了我們！我們永遠感謝你~\n下個問題：\n${adjQuestion}`,
        },
      ],
    });

    currentQuestionIndex++;
    return;
  } else if (currentQuestionIndex === 5) {
    answers.userAdj = event.message.text;
    const advQuestion = getQuest(advQuestions);
    await client.replyMessage({
      replyToken: event.replyToken,
      messages: [
        {
          type: "text",
          text: ` 你回答了我們！我們永遠感謝你~\n下個問題：\n${advQuestion}`,
        },
      ],
    });

    currentQuestionIndex++;
    return;
  } else if (currentQuestionIndex === 6) {
    answers.userAdv = event.message.text;
    const storyTemplate = [
      `在一個 ${answers.userAdj} 清晨，在某個  ${answers.userLoc} 的角落， ${answers.userName}  靜靜地盯著遠方的動物。它的 ${answers.userAdj}  眼睛閃爍著思考的光芒，而身邊的${answers.userNoun}  伙伴則在   ${answers.userAdv}  並輕快地跳躍著。這個  ${answers.userNoun}  生物沐浴在  ${answers.userAdj}  陽光下，享受著每一刻的寧靜。時間彷彿在這裡凝固，留下了一幅永恆的畫面。\n\n\n得意的一天過去了`,
      `${answers.userName}  在一個炎熱的  ${answers.userTime}  ，發現在   ${answers.userLoc}  中，突然出現了一座  ${answers.userAdj}   ${answers.userNoun}  。  ${answers.userNoun}  散發著陣陣涼意，而周圍的人們則在熱浪中  ${answers.userAdv}  翻滾。  ${answers.userName}  用力拍打  ${answers.userNoun}  。這個離奇的  ${answers.userAdj}  景象讓人們不禁驚嘆大自然的神奇，仿佛置身於一個奇幻的冰雪世界中，寒冷的一天過去了。\n\n\n`,
      `當  ${answers.userTime}  降臨，在一個  ${answers.userAdj}  的  ${answers.userLoc}  ，有一家小餐館，   ${answers.userName}  靜靜地等待著  ${answers.userNoun}  顧客的到來。它的招牌閃爍著迷人的燈光，而廚房裡的  ${answers.userAdj}  廚師則在熱情地烹飪著。這個地方彷彿被  ${answers.userName}  定格，讓  ${answers.userNoun}  們可以  ${answers.userAdv}  忘卻煩囂，  ${answers.userAdv}  專注享受  ${answers.userNoun}  美食的美好時刻。\n\n\n美好的一天過去了`,
    ];

    const getStory = (storyTemplate) => {
      const randomNum = parseInt(Math.random() * storyTemplate.length);
      return storyTemplate[randomNum];
    };
    const userStory = getStory(storyTemplate);
    await client.replyMessage({
      replyToken: event.replyToken,
      messages: [
        {
          type: "text",
          text: ` ${answers.userName}  你經歷了以下神秘事件...\n\n\n\n\n${userStory} 還喜歡嗎？ `,
        },
      ],
    });

    currentQuestionIndex++;
    return;
  } else if (currentQuestionIndex === 7) {
    client.replyMessage({
      replyToken: event.replyToken,
      messages: [
        {
          type: "text",
          text: `現在是幾年幾月幾日呢?`,
        },
      ],
    });

    currentQuestionIndex++;
    return;
  } else if (currentQuestionIndex === 8) {
    const date = event.message.text;
    const time = getTime();
    if (date === `${time.year}年${time.month}月${time.day + 1}日`) {
      await client.replyMessage({
        replyToken: event.replyToken,
        messages: [
          {
            type: "text",
            text: `次日，你在美好的清晨從床上醒來...\n\n\n遊戲結束`,
          },
        ],
      });
      currentQuestionIndex === 0;
      return;
    } else {
      await client.replyMessage({
        replyToken: event.replyToken,
        messages: [
          {
            type: "text",
            text: `你的答案錯誤！！時間之神懲罰你將永遠被困在同一天...`,
          },
        ],
      });
      currentQuestionIndex++;
      return;
    }
  } else if (currentQuestionIndex === 9) {
    const timeQuestion = getQuest(timeQuestions);
    await client.replyMessage({
      replyToken: event.replyToken,
      messages: [
        {
          type: "text",
          text: ` 你好${answers.userName}!請坐穩、深呼吸然後準備回答問題~\n${timeQuestion}`,
          quoteToken: event.message.quoteToken,
        },
      ],
    });

    currentQuestionIndex = 2;
    return;
  }

  // if (event.message.text === "好餓") {
  //   // 回覆一模一樣的訊息，多一個驚嘆號
  //   client.replyMessage({
  //     replyToken: event.replyToken,
  //     messages: [
  //       {
  //         type: "sticker",
  //         packageId: "446",
  //         stickerId: "1996",
  //       },
  //     ],
  //   });
  // } else {
  //   client.replyMessage({
  //     replyToken: event.replyToken,
  //     messages: [
  //       {
  //         type: "text",
  //         text: `${event.message.text}!`,
  //       },
  //     ],
  //   });
  // }
  // break;
}

app.listen(port, () => {
  console.log(`Sample LINE bot server listening on port ${port}...`);
});
