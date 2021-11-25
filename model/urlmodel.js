const mongoose= require('mongoose');

const urls=new mongoose.Schema({
    urlId: {
        type: String,
        required: true,
      },
      origUrl: {
        type: String,
        required: true,
      },
      shortUrl: {
        type: String,
        required: true,
      },
      clicks: {
        type: Number,
        required: true,
        default: 0,
      },
      date: {
        type: String,
        default: Date.now,
      }

})

const Url = mongoose.model('Url', urls);
module.exports =Url;