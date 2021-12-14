const request = require('../helper/request')

const endPointUrl = 'geo/search/'

describe(endPointUrl + ' endpoint', () => {
  describe('Positive Test', () => {
    it('It should return 200 when the request is made correctly', async () => {
      const response = await request.assertApiRequest(endPointUrl, {query:'Bologna'}, {expectedStatus: 200});
    })

    it('The object should contain information about latitude and longitude', async () => {
      const {body} = await request.assertApiRequest(endPointUrl, {query:'Bologna'}, {expectedStatus: 200});
      expect(body).toHaveProperty('latitude')
      expect(body).toHaveProperty('longitude')
    })
  })

  describe('Negative Test', () => {
    it('It should return 404 as status code when the id of the geo is not valid', async () => {
      await request.assertApiRequest(endPointUrl, {}, {expectedStatus: 500});
    })
  })
})
