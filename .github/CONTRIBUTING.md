# Contributing

Thank you for your interest in contributing to Flint!

## Getting up and Running

First install the dependencies:

```bash
npm install
```

If you are making changes to the admin dashboard, you'll need to add the `BUILD_DASHBOARD` variable to your `.env` file.

```
BUILD_DASHBOARD=true
```

Once that's done, you can go ahead and run:

```bash
npm start
```

Please discuss code changes before proposing a pull request by opening up an issue (especially if it's a new feature).

## Testing

There are (some) tests in place; please make sure that if you are adding functionality you are also writing tests. Travis CI has been setup to hopefully catch any significant bugs that new code introduces, but only if the relevant tests exist!

Flint uses the [`test-selector`](https://github.com/JasonEtco/test-selector) module to make testing specific portions of the app a bit faster and easier to identify. Running `npm run tst` will run the locally installed version, but installing `test-selector` as a global node module is suggested.

### 🎉 Emojis 🍆

Using emojis in commit messages is more than allowed, it's encouraged. They are fun and in many cases informative. That being said, there are some guidelines:
* Please only use one emoji and at the beginning of your commit message.
* If you do choose to put an emoji in a commit message, please do make sure that it has some kind of connection to the changes being proposed.

An example of a well-written commit message using an emoji:

```bash
👷 Add Travis-CI support
```
