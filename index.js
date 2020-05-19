const { createEventAdapter } = require("@slack/events-api");
const { WebClient } = require("@slack/web-api");
const Eris = require("eris");

// Keys
const slackKey = require("./slack.keys.js");
const discordKey = require("./discord.keys.js");

// Slack - Events
const slackEvents = createEventAdapter(slackKey.signingSecret);
const port = 80;

// Slack - Web
const slackWeb = new WebClient(slackKey.oauth_token);

// Discord Bot / Webhook
const discordBot = new Eris(discordKey.bot_token);

const forwardMessageToSlack = (msg) => {
  let displayName =
    msg.member && msg.member.nick ? msg.member.nick : msg.author.username;

  let avatarURL = msg.author.avatarURL.replace(/\.webp.*$/i, ".png");

  options = {
    token: slackKey.bot_token,
    channel: slackKey.channel_name,
    text: msg.content,
    username: displayName,
    icon_url: avatarURL,
  };

  slackWeb.chat.postMessage(options);
};

const forwardMessagetoDiscord = async (msg) => {
  const msg_norm = msg.text;
  const user_data = await slackWeb.users.info({ user: msg.user });
  const name = user_data.user.real_name;
  const image = user_data.user.profile.image_original;

  discordBot.executeWebhook(
    discordKey.hook_id,
    discordKey.hook_token,
    (options = { content: msg_norm, avatarURL: image, username: name })
  );
};

discordBot.on("messageCreate", (msg) => {
  if (
    msg.channel.name === discordKey.channel_name &&
    msg.author.bot === false
  ) {
    forwardMessageToSlack(msg);
  }
});

slackEvents.on("message", (msg) => {
  if (msg.type === "message" && msg.subtype === undefined) {
    forwardMessagetoDiscord(msg);
  }
});

(async () => {
  const server = await slackEvents.start(port);
  console.log(`Listening for slack events on ${server.address().port}.`);

  discordBot.connect();
  discordBot.on("ready", () => {
    console.log("Listening for discord events.");
  });
})();
