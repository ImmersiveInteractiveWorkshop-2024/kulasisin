// Based on https://line.github.io/line-bot-sdk-nodejs/getting-started/basic-usage.html#synopsis
const express = require("express");
const line = require("@line/bot-sdk");
const app = express();
const port = 3000;
const OpenAI = require("openai");

require("dotenv").config();

const Replicate = require("replicate");
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const config = {
  channelAccessToken: process.env.YOUR_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.YOUR_CHANNEL_SECRET,
};

const openai = new OpenAI();

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
const getArticle = (category, event) => {
  let randomNum = parseInt(Math.random() * articles[category].length);
  const article = articles[category][randomNum];
  console.log(article);
  const articleRes = [
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
  ];
  return articleRes;
};
let dialog = [
  {
    role: "system",
    content:
      "你是一個很有幫助的貓狗知識小達人及小幫手，請講台灣用的國語，並且以小狗狗自稱，每句話開頭都要加上「小狗狗覺得」、每一句結尾都要以「就是這樣，汪！」或是以「快給我好肉零食，汪汪！」作為結尾。",
  },
];
const getOpenAi = async (mode, text) => {
  if (mode === "chat") {
    dialog.push({ role: "user", content: text });
    const completion = await openai.chat.completions.create({
      messages: dialog,
      model: "gpt-3.5-turbo",
    });

    dialog.push({
      role: "assistant",
      content: completion.choices[0].message.content,
    });
    console.log(dialog);
    return completion;
  }
};

const getRep = async (prompt) => {
  console.log("Running the model...");
  const output = await replicate.run(
    "fofr/sdxl-emoji:dee76b5afde21b0f01ed7925f0665b7e879c50ee718c5f78a9d38e04d523cc5e",
    {
      input: {
        width: 1024,
        height: 1024,
        prompt: prompt,
        refine: "no_refiner",
        scheduler: "K_EULER",
        lora_scale: 0.6,
        num_outputs: 1,
        guidance_scale: 7.5,
        apply_watermark: false,
        high_noise_frac: 0.8,
        negative_prompt: "",
        prompt_strength: 0.8,
        num_inference_steps: 50,
      },
    }
  );
  console.log(output);
  return output;
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
          text: `您好，歡迎來到好肉小教室專欄，您需要甚麼呢？我們提供日常/有趣/健康三個類別的知識專欄呦$～（ps:使用咒語【小狗狗】，就可以召喚你的寵物AI！）`,
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
    const respond = getArticle("life", event);
    await client.replyMessage({
      replyToken: event.replyToken,
      messages: respond,
    });
    return;
  } else if (event.message.text.includes("有趣")) {
    const respond = getArticle("funfact", event);
    await client.replyMessage({
      replyToken: event.replyToken,
      messages: respond,
    });
    return;
  } else if (event.message.text.includes("健康")) {
    const respond = getArticle("health", event);
    await client.replyMessage({
      replyToken: event.replyToken,
      messages: respond,
    });
    return;
  } else if (event.message.text.includes("小狗狗")) {
    const aiMessages = [];
    getOpenAi("chat", event.message.text)
      .then(async (result) => {
        aiMessages.push({
          type: "text",
          text: `${result.choices[0].message.content}`,
        });
        const repResult = await getRep(
          event.message.text.replace("小狗狗", "")
        );
        aiMessages.push({
          type: "image",
          originalContentUrl: repResult[0],
          previewImageUrl: repResult[0],
        });
      })
      .finally(() => {
        // console.log("成功：", result);

        client.replyMessage({
          replyToken: event.replyToken,
          messages: aiMessages,
        });
        if (event.message.text.includes("再見")) {
          dialog = [
            {
              role: "system",
              content:
                "你是一個很有幫助的貓狗知識小達人及小幫手，請講台灣用的國語，並且以小狗狗自稱，每句話開頭都要加上「小狗狗覺得」、每一句結尾都要以「就是這樣，汪！」或是以「快給我好肉零食，汪汪！」作為結尾。",
            },
          ];
        }
      });
  }
}

app.listen(port, () => {
  console.log(`Sample LINE bot server listening on port ${port}...`);
});
