const mongoose = require('mongoose');
const PageContent = require('../src/models/PageContent');

mongoose.connect('mongodb://127.0.0.1:27017/transpower')
  .then(async () => {
    const doc = await PageContent.findOne({ key: 'homepage' });
    console.log(JSON.stringify(doc, null, 2));
    mongoose.disconnect();
  });
