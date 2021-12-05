const request = require('../helper/request')
const wait = require('../helper/wait');
const cleanText = require('../helper/cleanText');

const endPointUrl = '2/tweets/search/all'

describe(endPointUrl + ' endpoint', () => {

  describe('Positive Test', () => {
    let response = {}
    const query = 'creme brule'

    // NOTE: Non andrebbe fatto, ma facendo troppe richieste si rischia di ricevere 'Too Many request'
    beforeAll(async () => {
      response = await request.assertApiRequest(endPointUrl, {query: query})
    })

    it('It should return 200 as status code when the request is correct', () => {
      expect(response.status).toBe(200)
    })
    it('It should return an object', () => {
      expect(response.body).toBeInstanceOf(Object)
    })
    it('The object return should contain a data property containing each tweet information', () => {
      expect(response.body).toHaveProperty("data")
    })
    it('Each tweet must contain a text and id property', () => {
      response.body.data.forEach((elem) => {
        expect(elem).toHaveProperty('id')
        expect(elem).toHaveProperty('text')
      })
    })
    it('Each tweet must either contain the query or be cut', () => {
      response.body.data.forEach((elem) => {
        if(!elem.text.includes('…')){
          expect(cleanText(elem.text)).toContain(cleanText(query))
        }
      })
    })
  })

  describe('Negative test', () => {
    it('It should return 500 as status code when the request is not correct', async () => {
      // NOTE: visto che c'è un minimo delay di 1 ms fra richieste di questo endpoint aspetta un po' prima di fare la prosimma richiesta
      await wait.forMs(1500)
      await request.assertApiRequest(endPointUrl, {}, {expectedStatus: 500})
    })
  })
})
