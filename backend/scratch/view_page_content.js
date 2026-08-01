const mongoose = require('mongoose');
const PageContent = require('../src/models/PageContent');

mongoose.connect('mongodb://127.0.0.1:27017/transpower')
  .then(async () => {
    const docs = await PageContent.find({});
    console.log(JSON.stringify(docs, null, 2));
    mongoose.disconnect();
  });
