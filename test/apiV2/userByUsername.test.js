const request = require('../helper/request')
const endPointUrl = '/user/'
const userName = 'uniboswe3'

describe(endPointUrl + ':username endpoint', () => {
  describe('Positive Test', () => {
    let response = {}

    // NOTE: Non andrebbe fatto, ma facendo troppe richieste si rischia di ricevere 'Too Many request'
    beforeAll(async () => {
      response = await request.assertApiRequest(endPointUrl + userName, {})
    })

    it('It should return 200 as status code when the request is correct', () => {
      expect(response.status).toBe(200)
    })

    it('It should return an object containing a info abou the user', () => {
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('data')
      expect(response.body.data).toHaveProperty('name')
      expect(response.body.data).toHaveProperty('username')

    })

    it('It should return the data about the user of the query', () => {
      expect(response.body.data.username).toBe(userName)
    })
  })

  describe('Negative Test', () => {
    it('It should return 500 as status code when the user is is not valid', async () => {
      await request.assertApiRequest(endPointUrl + '.', {}, {expectedStatus: 500})
    })
  })
})
