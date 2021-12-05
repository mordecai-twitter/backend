const request = require('../helper/request')

describe('/termcloud endpoint', () => {
    describe('Positive test', () => {
      let response = {}

      // NOTE: Se lo vogliamo rendere più veloce si potrebbe mettere nel beforeAll, facendo quindi una richiesta per tutti i test
      // nel caso di questi test, visto che non modificano dati nella risposta, non ci sarebbero problemi
      beforeAll(async () => {
        response = await request.assertApiRequest('termcloud', {query:'novax'})
      })

      afterAll(() => {
        response = {}
      })

      it('It should return a status code of 200 if the request is made correctly', async () => {
        expect(response.status).toBe(200)
      })

      it('It should return an non-empty array', async () => {
        expect(response.body).toBeInstanceOf(Array)
        expect(response.body.length).toBeGreaterThan(0)
        // No assertion since the beforeEach handle it already
      })

      it('It should return an array of object each containing word and freq', async () => {
        const {body} = response
        body.forEach(elem => {
            expect(elem).toHaveProperty("word");
            expect(elem).toHaveProperty("freq");
        })
      })

      it('Each freq property should have a positive value', async () => {
        const {body} = response
        body.forEach(elem => {
            expect(elem.freq).toBeGreaterThanOrEqual(0);
        });
      })

      it('Each word must not be empty', async () => {
        const {body} = response
        body.forEach(elem => {
            expect(elem.word.length).toBeGreaterThanOrEqual(0);
        });
      })
    })

    describe('Negative test', () => {
      it('It should return a status code of 500 if no query is inserted in the request', async () => {
        await request.assertApiRequest('termcloud', {}, {expectedStatus: 500})
      })
    })
})
