var mongoose = require('mongoose')

var CategorySchema = new mongoose.Schema({
  slug: { type: String, required: true, index: true },
  title: { type: String, required: true },
  query: { type: String, required: true },
  disabled: { type: Boolean, default: false, index: true },

  logo: { type: String },
  subtitle: { type: String },

  steps: [
    { type: String },
  ],

  faq: [
    {
      type: mongoose.Schema.Types.Mixed,

      question: String,
      answer: String
    }
  ],

  created: { type: Date, default: Date.now },

  __v: { type: Number, select: false }
})

module.exports = mongoose.model('Category', CategorySchema)
