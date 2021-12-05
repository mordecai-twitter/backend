const request = require('../helper/request')
const endPointUrl = 'statuses/user_timeline'

describe(endPointUrl + ' endpoint', () => {
  describe('Positive Test', () => {
    let response = {}
    const user_id = 6253282

    // NOTE: Non andrebbe fatto, ma facendo troppe richieste si rischia di ricevere 'Too Many request'
    beforeAll(async () => {
      response = await request.assertApiRequest(endPointUrl, {user_id: user_id})
    })

    it('It should return 200 as status code when the request is correct', () => {
      expect(response.status).toBe(200)
    })

    it('It should return an array', () => {
      expect(response.body).toBeInstanceOf(Array)
    })

    it('Each object should be a tweet information, containing various property such as text, id, created_at', () => {
      response.body.forEach(elem => {
        expect(elem).toHaveProperty("text")
        expect(elem).toHaveProperty("id")
        expect(elem).toHaveProperty("created_at")
        expect(elem).toHaveProperty("user")
      });
    })

    it('Each tweet must be created by the user of the query', () => {
      response.body.forEach(elem => {
        expect(elem.user.id).toBe(user_id)
      });
    })

  })

  describe('Negative Test', () => {
    it('It should return 500 as status code when the request is made incorrectly', async () => {
      await request.assertApiRequest(endPointUrl, {}, {expectedStatus: 500})
    })
  })

})
