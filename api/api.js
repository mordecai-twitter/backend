const TwitterApi = require('twitter-api-v2').TwitterApi

// Sentiment analysis
var sentiment = require('multilang-sentiment');

const express = require('express')
var router = express.Router()

const twitter = new TwitterApi(process.env.TWITTER_API_BEARER_TOKEN).readOnly;

function handleError(err, res){
  console.log(res.body)
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

router.get('/statuses/show/:id', async (req, res) => {
  const id = req.params.id
  const query = req.query
  try{
    let response = await twitter.v1.get('statuses/show.json', { ...query, id })
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
    const geoLocal = await twitter.v1.get('geo/search.json', { ...query, max_results: '1'})
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
  try{
    const user = await twitter.v2.userByUsername(username)
    res.status(200).json(user)
  }
  catch (err){
    handleError(err, res)
  }
})

router.get('/statuses/user_timeline', async (req, res) => {
  const query = req.query || {}
  console.log(query)
  try{
    const response = await twitter.v1.get('statuses/user_timeline.json', query)
    res.status(200).json(response)
  } catch (e) {
    handleError(e, res)
  }
})

router.get('/2/tweets/counts/recent', async (req, res) => {
  const query = req.query || {}
  console.log(query)
  try{
    const response = await twitter.v2.get('tweets/counts/recent', query)
    res.status(200).json(response)
  } catch (e) {
    handleError(e, res)
  }
})

router.get('/geo/id/:place_id', async (req, res) => {
  const place_id = req.params.place_id
  console.log(place_id)
  try{
    const response = await twitter.v1.get(`geo/id/${place_id}.json`)
    res.status(200).json(response)
  } catch (e) {
    handleError(e, res)
  }
})

router.get('/sentiment', async (req, res) => {

  const { query, ...parameters } = req.query
  console.log(query, parameters)
  let valutation = {
    score: 0,
    comparative: 0,
    positive: [],
    negative: [],
    best: {
      score: -Infinity,
      tweet: {}
    },
    worst: {
      score: Infinity,
      tweet: {}
    },
    positiveCount: 0,
    negativeCount: 0,
    neutralCount: 0
  }
  /**
   * Analyze a single tweet
   * @param  {Object} tweet  Tweet object.
   * @param  {Object} valutation   Valutation Object.
   */
  function analyzeTweet(tweet){
    // Text pre-processing (removing "@", "#" for a better analysis of tweets)
    const regExHash = new RegExp('#', "g")
    const regExTag = new RegExp('@', "g")
    let toAnalyze = tweet.text.replace(regExHash, "")
    toAnalyze = tweet.text.replace(regExTag, "")
    try {
      const evalTweet = sentiment(toAnalyze, tweet.lang)
      switch (evalTweet.category) {
        case 'neutral':
          valutation.neutralCount += 1
          break;
        case 'negative':
          valutation.negativeCount += 1
        case 'positive':
          valutation.positiveCount += 1
      }
      // console.log(evalTweet)
      valutation.score += evalTweet.score
      if(evalTweet.score > valutation.best.score){
        valutation.best.score = evalTweet.score
        valutation.best.tweet = tweet
      }
      else if(evalTweet.score < valutation.worst.score){
        valutation.worst.tweet = tweet
        valutation.worst.score = evalTweet.score
      }
      valutation.comparative += evalTweet.comparative
      valutation.negative.push(...evalTweet.negative)
      valutation.positive.push(...evalTweet.positive)
      // console.log(evalTweet.calculation)
    } catch (e) {
      // Error occure, ignoring this tweet
      console.log(tweet.lang)
      console.log(e)
    }
  }
  try {
    const timeline = await twitter.v2.search(query, { ...parameters, "tweet.fields": "lang" })
    await timeline.fetchLast(200)
    for (let tweet of timeline) {
      if(tweet.lang !== "und")  analyzeTweet(tweet, valutation)
    }
    valutation.comparative = valutation.comparative / valutation.count
    res.status(200).json(valutation)
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})

module.exports = router
