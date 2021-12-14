const request = require('../helper/request')

const endPointUrl = '/statuses/show/'
const tweetID = '1470776632336162826'

describe(endPointUrl + ' endpoint', () => {
  describe('Positive Test', () => {
    let response = {}
    it('It should return 200 when the request is made correctly', async () => {
      response = await request.assertApiRequest(endPointUrl + tweetID, {expectedStatus: 200});
    })

    it('The body should be an object containing info about the tweet', () => {
      expect(response.body).toHaveProperty('id')
      expect(response.body).toHaveProperty('created_at')
      expect(response.body).toHaveProperty('text')
      expect(response.body).toHaveProperty('user')
    })

    it('The tweet id must be the same as the query', () => {
      expect(response.body.id_str).toBe(tweetID)
    })
  })

  describe('Negative Test', () => {
    it('It should return 404 as status code when the id of the geo is not valid', async () => {
      await request.assertApiRequest(endPointUrl + "aaaa", {}, {expectedStatus: 500});
    })
  })
})
