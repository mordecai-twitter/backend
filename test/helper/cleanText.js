const TextCleaner = require('text-cleaner')

function cleanText(text) {
  const temp = TextCleaner(text).toLowerCase().condense().toString()
  return temp.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

module.exports = cleanText
