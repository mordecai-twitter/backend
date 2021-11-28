const TwitterApi = require('twitter-api-v2').TwitterApi
const TextCleaner = require('text-cleaner')

// Sentiment analysis
var sentiment = require('multilang-sentiment');

const express = require('express')
var router = express.Router()

const twitter = new TwitterApi(process.env.TWITTER_API_BEARER_TOKEN).readOnly;

function handleError(err, res){
  console.log(err)
  res.status(500).json(err)
}

router.get('/2/tweets/search/all', async (req, res) => {
  const query = req.query
  console.log(query)
  try{
    let response = await twitter.v2.get('tweets/search/all', query)
    res.status(200).json(response)
  }
  catch (err) {
    handleError(err, res)
  }
})

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

router.get('/2/user/:id', async (req, res) => {
  const userId = req.params.id
  const query = req.query
  try{
    const user = await twitter.v2.user(userId, query)
    res.status(200).json(user)
  }
  catch (err){
    handleError(err, res)
  }
})

router.get('/statuses/user_timeline', async (req, res) => {
  const query = req.query || {}
  try{
    const response = await twitter.v1.get('statuses/user_timeline.json', query)
    res.status(200).json(response)
  } catch (e) {
    handleError(e, res)
  }
})

router.get('/2/tweets/counts/recent', async (req, res) => {
  const query = req.query || {}
  try{
    const response = await twitter.v2.get('tweets/counts/recent', query)
    res.status(200).json(response)
  } catch (e) {
    handleError(e, res)
  }
})

router.get('/geo/id/:place_id', async (req, res) => {
  const place_id = req.params.place_id
  try{
    const response = await twitter.v1.get(`geo/id/${place_id}.json`)
    res.status(200).json(response)
  } catch (e) {
    handleError(e, res)
  }
})

router.get('/sentiment', async (req, res) => {

  const { query, ...parameters } = req.query
  console.log("\n\nSENTIMENT query and parameters")
  console.log(query, parameters)
  console.log("\n\n")
  let valutation = {
    score: 0,
    comparative: 0,
    // positive: [],
    // negative: [],
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
    let toAnalyze = tweet.text.replace(regExHash, "").replace(regExTag, "")
    try {
      const evalTweet = sentiment(toAnalyze, tweet.lang)
      switch (evalTweet.category) {
        case 'neutral':
          valutation.neutralCount += 1
          break
        case 'negative':
          valutation.negativeCount += 1
          break
        case 'positive':
          valutation.positiveCount += 1
          break
      }
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
      // do we need this?
      // valutation.negative.push(...evalTweet.negative)
      // valutation.positive.push(...evalTweet.positive)
    } catch (e) {
      // Error occure, ignoring this tweet (logging error for debug: )
      console.log(e)
    }
  }
  try {
    const timeline = await twitter.v2.search(query, { ...parameters, "tweet.fields": "lang" })
    await timeline.fetchLast(100)
    for (let tweet of timeline) {
      if(tweet.lang !== "und")  analyzeTweet(tweet)
    }
    valutation.comparative = valutation.comparative / (valutation.positiveCount + valutation.negativeCount + valutation.neutralCount)
    res.status(200).json(valutation)
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})

router.get('/termcloud', async (req, res) => {
  const tweetCount = 200
  const wordCount = 50
  const minWordLength = 3
  const { query, ...parameters } = req.query

  function cleanText(text) {
    // Regex that match puctuation characters, the special characters … used by twitter
    const excludedCharRegex = /(\.|,|-|:|\.{3}|…)/g

    // It transforms the text to lower case, strip html tag, condense multiple spaces in one,
    // remove stop words such as the, some, with, and then remove characters from the regex
    return TextCleaner(text).toLowerCase().stripHtml().condense().removeStopWords()
                            .trim().replace(excludedCharRegex, '');
  }

  function calculateWordsFrequency(words){
    const wordCounts = {};
    for(let i = 0; i < words.length; i++){
      wordCounts[words[i]] = (wordCounts[words[i]] || 0) + 1
    }
    return wordCounts
  }

  function sortDictionaryByValue(dict, limit) {
    // Create items array
    let items = Object.keys(dict).map(function(key) {
      return [key, dict[key]];
    });

    // Sort the array based on the second element
    items.sort(function(first, second) {
      return second[1] - first[1];
    });
    items = items.splice(0, limit);

    const sortedObj = []
    items.forEach(elem => {
        const obj = {
          word: elem[0],
          freq: elem[1]
        }

        sortedObj.push(obj);
    })

    return sortedObj;
  }

  try {

    const timeline = await twitter.v2.search(query, { ...parameters})
    const tweets = (await timeline.fetchLast(tweetCount)).tweets

    const texts = tweets.map(x => x.text)
    const arrayOfWords = texts.map(x => x.split(/\s/))
    const words = arrayOfWords.flat(1)
    const cleanedWords = words.map(x => cleanText(x)).filter(x => x.length > minWordLength)
    const frequency = calculateWordsFrequency(cleanedWords)
    const sortedFrequency = sortDictionaryByValue(frequency, wordCount)
    res.status(200).json(sortedFrequency)
  } catch (error) {
    handleError(error, res)
  }
})

module.exports = router
