const request = require('../helper/request')

const endPointUrl = '/contest/'

describe(endPointUrl + ' endpoint', () => {
  describe('Positive Test', () => {
    let response = {}
    it('It should return 200 when the request is made correctly', async () => {
      response = await request.assertApiRequest(endPointUrl, {query:'#UniboSWE3 #Contest #preview'}, {expectedStatus: 200});

    })

    it('The body should be contain a property data which should be an array', () => {
      expect(response.body).toHaveProperty('data')
      expect(response.body.data).toBeInstanceOf(Array)
    })

    it('Each object of the array should contain information about a tweet', () => {
      response.body.data.forEach((item) => {
        expect(item).toHaveProperty('id')
        expect(item).toHaveProperty('text')
      });
    })
  })

  describe('Negative Test', () => {
    it('It should return 404 as status code when the id of the geo is not valid', async () => {
      await request.assertApiRequest(endPointUrl, {}, {expectedStatus: 500});
    })
  })
})
