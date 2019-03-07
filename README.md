# [FlintCMS](https://flintcms.co) &middot; [![npm version](https://img.shields.io/npm/v/flintcms.svg?style=flat)](https://www.npmjs.com/package/flintcms) [![Build Status](https://img.shields.io/travis/JasonEtco/flintcms/master.svg)](https://travis-ci.org/JasonEtco/flintcms) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md) [![Codecov](https://img.shields.io/codecov/c/github/JasonEtco/flintcms.svg)](https://codecov.io/gh/JasonEtco/flintcms/)

Flint is a CMS built to be easy to use and super flexible. Your content needs to fit into more layouts and environments than anyone but you can plan for, so Flint enables you to make the templates you need and fill it with your content.

It's a CMS that is built for those who want to fully design the front-end of their website without wanting to deal with static site generators or older content management systems (that are slow and use outdated technology).

## Why?

Every content management system falls into one of two categories: can be customized a ton but is very cumbersome to work with, or can be customized too little but is very straightforward. Only a few seem to find that perfect balance; [CraftCMS](https://craftcms.com), which Flint is ultimately inspired by, is a great example. However, there are very few systems that take advantage of the performance and ecosystem of Node.js. Flint is really fast and is written using modern web standards so that newer developers can jump in, plus it's open source so more and more people can help make it better.

## Getting Started

```bash
npm install flintcms --save
```

Then the entry point to your app:
```js
const Flint = require('flintcms');

const siteConfig = {
  siteName: 'My Awesome Flint Site',
};

const flintServer = new Flint(siteConfig);

flintServer.startServer();
```

That's the basics! There's more to it than that, you can [take a look at the docs](https://flintcms.co/docs) to learn more.

## Requirements

FlintCMS employs new Node.js standards and functionality, so `^8.0.0` is the supported version.

You'll need a MongoDB database of some kind, and you'll likely want a way to send emails through your site; you can read more about all of this [on the FlintCMS docs](https://flintcms.co/docs/).

## Building with Flint?

If you're using FlintCMS in a project, thats awesome and I want to know! Feel free to [open up an issue](https://github.com/JasonEtco/flintcms/issues/new) to let me know, and I'd be happy to list your project in this README.

## Contributing

Thanks for your intesting in contributing to FlintCMS :sparkling_heart: There are some things you need to know about how to contribute well, you can read about it in the [CONTRIBUTING](https://github.com/JasonEtco/flintcms/blob/master/.github/CONTRIBUTING.md) file.
