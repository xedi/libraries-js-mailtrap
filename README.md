# Mailtrap API Wrapper

[![Actions Status](https://github.com/xedi/libraries-js-mailtrap/workflows/Node%20CI/badge.svg)](https://github.com/xedi/libraries-js-mailtrap/actions)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&identifier=204934407)](https://app.dependabot.com/accounts/xedi/repos/204934407)

## Installation

Install via NPM.

```shell
npm install --save @xedi/mailtrap
```

## Usage

```js
import Mailtrap from 'mailtrap';

// pass in your API Token
Mailtrap.setApiToken(process.env.MAILTRAP_API_TOKEN);

// You can also set a alternative URL for your Mailtrap service
// though this has a default of https://mailtrap.io
Mailtrap.setMailtrapUrl(process.env.MAILTRAP_URL);

// To access an inbox call it from the Mailtrap Facade.
const inbox = await Mailtrap.inbox(process.env.MY_INBOX_ID);

// You can also list all inboxes attached to the account
const inboxes = await Mailtrap.inboxes();

```
---

Made with 🤬 and 🍺 for @Jonny-webedi
