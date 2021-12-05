async function forMs(ms) {
  return new Promise( res => setTimeout(res, ms))
}

module.exports = {forMs}
