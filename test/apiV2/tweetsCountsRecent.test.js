const request = require('../helper/request')
const endPointUrl = '2/tweets/counts/recent'

describe(endPointUrl + ' endpoint', () => {
  describe('Positive Test', () => {
    let response = {}

    // NOTE: Non andrebbe fatto, ma facendo troppe richieste si rischia di ricevere 'Too Many request'
    beforeAll(async () => {
      response = await request.assertApiRequest(endPointUrl, {query: 'novax'})
    })

    it('It should return 200 as status code when the request is correct', () => {
      expect(response.status).toBe(200)
    })

    it('It should return an object containing a property data which should be an array', () => {
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('data')
      expect(response.body.data).toBeInstanceOf(Array)
    })

    it('Each entry of data should contain a end date, start date and tweet_count property', () => {
      response.body.data.forEach(item => {
        expect(item).toHaveProperty('end')
        expect(item).toHaveProperty('start')
        expect(item).toHaveProperty('tweet_count')
        expect(item.tweet_count).toBeGreaterThanOrEqual(0)
      });
    })
  })

  describe('Negative Test', () => {
    it('It should return 500 as status code when the request is made incorrectly', async () => {
      await request.assertApiRequest(endPointUrl, {}, {expectedStatus: 500})
    })
  })
})
