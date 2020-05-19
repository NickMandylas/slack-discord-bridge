# slack-discord-bridge

Light weight text channel bridge between Slack & Discord.  
Utilises Slack Events API & Web API, no more creating "old" slack apps & using deprecated RTM libraries.  
Credit to @HackSoc for original inspiration.

![](https://i.imgur.com/MUXSnXK.png)

## Installation

Before installation please ensure you have [Node.js](https://nodejs.org/en/download/) and [NPM](https://www.npmjs.com/get-npm) installed on your machine.

**Step 1:** Clone repository & install dependency packages.

```
git clone https://github.com/NickMandylas/slack-discord-bridge
cd slack-discord-bridge
npm install
```

**Step 2:** Setup Slack App / API Keys.

1. Head to Slack API and [create an app](https://api.slack.com/apps).
2. Go to Basic Information (if not already there) and save the `signing secret` to `slack.keys.js`.
3. Go to OAuth & Permissions and scroll down to scopes & add the following:

   1. Bot Token Scopes: `chat:write`, `chat:write.customize` & `users:read`.
   2. User Token Scopes: `channels:history`

4. Still on the OAuth & Permissions page, scroll to the top and click `Install App to Workspace`. Proceed through the installation prompts. This will provide you your `OAuth Access Token` & `Bot User OAuth Access Token`. Add these tokens to your `slack.keys.js` file.

5. Go to Events Subscriptions & complete the following:

   1. `Turn On` Enable Events.

   2. Click `Subscribe to events on behalf of users` & add `message.channels` to the permission scope.
   3. We now need to verify our request URL. Run this command in the slack-discord-bridge folder:  
      `./node_modules/.bin/slack-verify --secret <signing_secret> --port=80`.  
      Replace <signing_secret> with your signing secret that was retrieved from step 2.  
      Then enter in http://<your domain or ip>/slack/events to the Request URL.  
      Once verified you can stop the script.

**Step 3:** Setup Discord Bot / API Keys.

1. Head over to Discord Developers Page & [create a new application](https://discord.com/developers/applications).

2. On the side panel, click Bot. Add a new bot & copy the Token to `Discord.keys.js`.

3. On the side panel, click OAuth2. We'll create a link to invite our bot to our server.

   1. Tick the `bot` checkbox under scopes.
   2. Tick the `Read Message History` permission.
   3. Copy the URL above, and paste it into your browser. This will open a prompt to add the bot to your server.

4. Now we'll create a web hook for the discord channel receiving the slack message.
   1. Click `Edit Channel` (the gear icon next to the channel name).
   2. On the side panel, click Webhooks add create a Webhook.
   3. Copy the Webhook URL, and paste the Webhook ID & token into the relevant fields in the `Discord.keys.js` file.

**Step 4:** Set the channels that'll be the bridge in both the `Discord.keys.js` & `Slack.keys.js` file.

## Usage

```
npm start
```

If you need to run the application in the background, please install [pm2](https://pm2.keymetrics.io/) & run.

```
pm2 start index.js
```

## Other Information

**Bugs / Todos**

- Currently if you @ a user on either Discord or Slack, it returns the user ID, not the string.
- File sharing

**Using on your local machine?**

Don't have access to a public IP address? Or is port 80 blocked? Use & install [ngrok](https://ngrok.com/).

- Run `ngrok http 3000`.
- You'll need to change the port to 3000 in index.js.
- As well run this command `./node_modules/.bin/slack-verify --secret <signing_secret> --port=3000` using port 3000.

Slack delve more into using ngrok in their [events-api](https://www.npmjs.com/package/@slack/events-api) documentation.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
