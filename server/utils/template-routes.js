const mongoose = require('mongoose');
const express = require('express');
const compile = require('./compile');
const getEntryData = require('./get-entry-data');
const handleCompileErrorRoutes = require('./handle-compile-error-routes');
const Page = mongoose.model('Page');
const router = express.Router();

router.get('/', async (req, res, next) => {
  const homepage = await Page.findOne({ homepage: true }).lean().exec();
  const homepageTemplate = homepage ? homepage.template : 'server-default-homepage';
  try {
    const compiled = await compile(homepageTemplate, homepage);
    return handleCompileErrorRoutes(req, res, compiled, homepageTemplate);
  } catch(err){ next(err); }
});

router.get('*', async (req, res, next) => {
  const page = await Page.findOne({ route: req.originalUrl }).lean().exec();
  if (!page) return next();

  try {
    const compiled = await compile(page.template, page);
    return handleCompileErrorRoutes(req, res, compiled, page.template);
  } catch(err){ next(err); }
});

router.get('/:section/:slug', async (req, res, next) => {
  const entry = await getEntryData(req.params);
  if (!entry) return next();

  try{
    const compiled = await compile(entry.template, entry);
    return handleCompileErrorRoutes(req, res, compiled, entry.template);
  } catch(err){ next(err); }
});

/*
* 404
*/
router.use((req, res) => handleCompileErrorRoutes(req, res, 'no-exist'));

/*
* Error handler route
*/
router.use( async (err, req, res, next) => {
  const compiled = await compile('server-error.njk', {error:err, stack:err.stack});
  return res.status(500).send(compiled);
})

module.exports = router;
