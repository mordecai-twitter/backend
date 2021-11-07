const TwitterApi = require('twitter-api-v2').TwitterApi

const express = require('express')
var router = express.Router()

const twitter = new TwitterApi(process.env.TWITTER_API_BEARER_TOKEN).readOnly;


function handleError(err, res){
  console.log(err)
  res.status(500).json(err)
}

router.get('/search/tweets', async (req, res) => {
  const query = req.query
  try{
    let response = await twitter.v1.get('search/tweets.json', query)
    res.status(200).json(response)
  }
  catch (err) {
    handleError(err, res)
  }
})

router.get('/geo/search', async (req, res) => {
  //  rotta per ottenere coordinate dato il luogo
  //  valori ritornati: longitudine/latitudine
  const query = req.query
  try{
    const geoLocal = await twitter.v1.get('geo/search', { ...query, max_results: '1'})
    const long = geoLocal.result.places[0].centroid[0]
    const lat = geoLocal.result.places[0].centroid[1]
    res.status(200).json({
      latitude : lat,
      longitude: long
    })
  }
  catch (err){
    handleError(err, res)
  }
})

router.get('/user/:username', async (req, res) => {
  const username = req.params.username
  const query = req.query || {}
  try{
    const user = await twitter.v2.userByUsername(username)
    const userId = user.data.id
    const response = await twitter.v1.get('statuses/user_timeline.json', { ...query, user_id: userId })
    res.status(200).json(response)
  }
  catch (err){
    handleError(err, res)
  }
})

module.exports = router
