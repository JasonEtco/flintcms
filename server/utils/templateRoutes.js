const mongoose = require('mongoose');
const express = require('express');
const compile = require('./compile');
const fourOhFourHandler = require('./fourOhFourHandler');
const getEntryData = require('./getEntryData');

const Page = mongoose.model('Page');
const router = express.Router();

router.get('/', async (req, res) => {
  const homepage = await Page.findOne({ homepage: true }).lean().exec();
  const compiled = await compile(homepage.template, homepage);
  res.send(compiled);
});

router.get('*', async (req, res, next) => {
  if (req.originalUrl.startsWith('/admin')) next();
  const page = await Page.findOne({ route: req.originalUrl }).lean().exec();
  if (!page) next();

  const compiled = await compile(page.template, page);
  res.send(compiled);
});

router.get('/:section/:slug', async (req, res) => {
  const EntryData = await getEntryData(req.params);

  if (!EntryData) {
    fourOhFourHandler(res);
    return;
  }

  const compiled = await compile(EntryData.template, EntryData);
  res.send(compiled);
});

module.exports = router;
