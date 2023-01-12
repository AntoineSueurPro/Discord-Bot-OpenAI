const {
  Client,
  GatewayIntentBits,
  Discord,
  VoiceChannel,
} = require("discord.js");
const {
  joinVoiceChannel,
  createAudioPlayer,
  NoSubscriberBehavior,
  createAudioResource,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  entersState,
} = require("@discordjs/voice");
const axios = require("axios");
const { token } = require("./env.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

let channelId = null;
let isVoice = false;
let connection = null;
let body = null;
let url = null;

client.on("ready", () => {
  console.log(`Logged in as ${client.user.id}!`);
});

client.on("messageCreate", (message) => {
  if (message.author.bot) {
    return;
  } else {
    console.log(message.content);

    if (message.content.split(" ")[0] == `<@${client.user.id}>`) {
      channelId = message.channelId;

      let prompt = message.content.split(" ");
      if (prompt[1] == "Génère") {
        generateLoadingText();
        prompt.shift();
        prompt.shift();
        prompt = prompt.join(" ");
        url = "https://api.openai.com/v1/images/generations";
        body = {
          prompt: prompt,
          n: 1,
          size: "512x512",
        };
        Promise.all([req(url, JSON.stringify(body))])
          .then((data) => {
            client.channels.cache.get(channelId).send(data[0].data[0].url);
          })
          .catch((error) => {
            client.channels.cache
              .get(channelId)
              .send(
                "Il semblerait que je sois cassé ou que le quota a été dépassé. Désolé."
              );
          });
      } else if (prompt[1] == "!join") {
        if (isVoice == false) {
          connection = joinVoiceChannel({
            channelId: message.channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator,
          });
          isVoice = true;
        }
      } else if (prompt[1] == "!quit") {
        connection.disconnect();
        isVoice = false;
      } else {
        if (!isVoice) {
          generateLoadingText();
        }

        prompt.shift();
        prompt = prompt.join(" ");
        body = {
          model: "text-davinci-003",
          prompt: prompt,
          temperature: 0.7,
          max_tokens: 1000,
        };
        url = "https://api.openai.com/v1/completions";
        Promise.all([req(url, JSON.stringify(body))])
          .then((data) => {
            console.log(data[0].choices);
            if (!isVoice) {
              client.channels.cache
                .get(channelId)
                .send(data[0].choices[0].text);
            } else {
              console.log("voice");
              const resource = createAudioResource(
                "http://api.voicerss.org/?key=" +
                  process.env.TOKENVOICE +
                  "&c=AAC&hl=fr-fr&f=48khz_16bit_stereo&v=Axel&src=" +
                  data[0].choices[0].text,
                {
                  inlineVolume: true,
                }
              );

              const player = createAudioPlayer();
              connection.subscribe(player);
              player.play(resource);
            }
          })
          .catch((error) => {
            console.log(error);
            if (!isVoice) {
              client.channels.cache
                .get(channelId)
                .send(
                  "Il semblerait que je sois cassé ou que le quota a été dépassé. Désolé"
                );
            } else {
              const resource = createAudioResource(
                "http://api.voicerss.org/?key=" +
                  process.env.TOKENVOICE +
                  "&c=AAC&hl=fr-fr&f=48khz_16bit_stereo&v=Axel&src=Il semblerait que je sois cassé ou que le quota a été dépassé. Désolé",
                {
                  inlineVolume: true,
                }
              );

              const player = createAudioPlayer();
              connection.subscribe(player);
              player.play(resource);
            }
          });
      }
    }
  }
});

client.login(process.env.TOKENBOT);

function generateLoadingText() {
  let loadingMessages = [
    "Hmmm...",
    "Laisse moi réfléchir...",
    "Une petite seconde.",
    "Ah quand même.",
    "Laisse moi juste le temps de réfléchir",
    "Chelou cette question mais ok attend.",
  ];
  let messageToShow =
    Math.floor(Math.random() * (loadingMessages.length - 1)) + 1;
  client.channels.cache.get(channelId).send(loadingMessages[messageToShow]);
}

async function req(url, body) {
  return axios
    .post(url, body, {
      headers: {
        authorization: "Bearer " + process.env.TOKENAPI,
        Accept: "application/json",
        "content-type": "application/json",
      },
    })
    .then(({ data }) => {
      return data;
    });
}
