const request = require('../helper/request')

const endPointUrl = '/search/tweets'
describe(endPointUrl + ' endpoint', () => {

  describe('Positive Test', () => {
    let response = {}

    // NOTE: Non andrebbe fatto, ma facendo troppe richieste si rischia di ricevere 'Too Many request'
    beforeAll(async () => {
      response = await request.assertApiRequest(endPointUrl, {q: 'novax'})
    })

    it('It should return 200 as status code when the request is correct', () => {
      expect(response.status).toBe(200)
    })
    it('It should return an object', () => {
      expect(response.body).toBeInstanceOf(Object)
    })
    it('The object return should contain a statuses property containing each tweet information', () => {
      expect(response.body).toHaveProperty("statuses")
    })
    it('Each tweet must contain a text and id property', () => {
      response.body.statuses.forEach((elem) => {
        expect(elem).toHaveProperty('id')
        expect(elem).toHaveProperty('text')
      })
    })

  })

  describe('Negative test', () => {
    it('It should return 500 as status code when the request is made incorrectly', async () => {
      const response = await request.assertApiRequest(endPointUrl, {}, {expectedStatus: 500})
    })
  })
})
