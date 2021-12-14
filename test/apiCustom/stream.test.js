const request = require('../helper/request')

const endPointUrl = "/stream"

describe(endPointUrl + ' endpoint', () => {
    describe('Negative Test', () => {
      it('It should return 500 as status code when the request is made incorrectly', async () => {
        await request.assertApiRequest(endPointUrl, {}, {expectedStatus: 500})
      })
    })
})
