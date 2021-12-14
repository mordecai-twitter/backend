
const request = require('../helper/request')

const endPointUrl = '/geo/id/'
const geoID = '0a63908f39d63000'

describe(endPointUrl + ' endpoint', () => {
  describe('Positive Test', () => {
    it('It should return 200 when the request is made correctly', async () => {
      const ret = await request.assertApiRequest(endPointUrl + geoID, {}, {expectedStatus: 200});
    })

    it('It should return an object', async () => {
      const {body} = await request.assertApiRequest(endPointUrl + geoID, {});
      expect(body).toBeInstanceOf(Object)
    })

    it('The object should contain information about the place such as a name, a country, an id', async () => {
      const {body} = await request.assertApiRequest(endPointUrl + geoID, {});
      expect(body).toHaveProperty('name')
      expect(body).toHaveProperty('country')
      expect(body).toHaveProperty('id')
    })

    it('The id returned must match the geoID passed as query', async () => {
      const {body} = await request.assertApiRequest(endPointUrl + geoID, {});
      expect(body.id).toBe(geoID)
    })
  })

  describe('Negative Test', () => {
    it('It should return 500 as status code when the id of the geo is not valid', async () => {
      await request.assertApiRequest(endPointUrl + 'aaa', {}, {expectedStatus: 500});
    })
  })
})
