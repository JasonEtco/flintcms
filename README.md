# [FlintCMS](https://flintcms.co)

Flint is a CMS built to be easy to use and super flexible. Your content needs to fit into more layouts and environments than anyone but you can plan for, so Flint enables you to make the templates you need and fill it with your content.

It's a CMS that is built for those who want to fully design the front-end of their website without wanting to deal with static site generators or older content management systems (that are slow and use outdated technology).

## Why?

Every content management system falls into one of two categories: can be customized a ton but is very cumbersome to work with, or can be customized too little but is very straightforward. Only a few seem to find that perfect balance; [CraftCMS](https://craftcms.com), which Flint is ultimately inspired by, is a great example. However, there are very few systems that take advantage of the performance of newer, "sexier" stacks using Node.js. Flint is really fast and is written using modern web standards so that newer developers can jump in, plus it's open source so more and more people can help make it better.

## Getting Started

```
npm install flintcms
```

Then the entry point to your app:
```js
const Flint = require('flintcms').Flint;

const siteConfig = {
  siteName: 'My Awesome Flint Site',
};

const flintServer = new Flint(siteConfig);

flintServer.startServer();
```

That's the basics! There's more to it than that, you can [take a look at the docs](https://flintcms.co/docs) to learn more.
