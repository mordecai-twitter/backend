const request = require('../helper/request')

const endPointUrl = "/sentiment"

describe(endPointUrl + ' endpoint', () => {
    describe('Positive test', () => {
      let response = {}

      // NOTE: Se lo vogliamo rendere più veloce si potrebbe mettere nel beforeAll, facendo quindi una richiesta per tutti i test
      // nel caso di questi test, visto che non modificano dati nella risposta, non ci sarebbero problemi
      beforeAll(async () => {
        // NOTE: Ci mette molto a fare la richiesta, per evitare che jest lo dia come errore aumento il tempo di attesa (il 120000 come ultimo argomento)
        response = await request.assertApiRequest(endPointUrl, {query:'novax'})
      }, 120000)

      afterAll(() => {
        response = {}
      })

      it('It should return a status code of 200 if the request is made correctly', () => {
        expect(response.status).toBe(200);
      })

      it('It should return an object containing various property', () => {
        expect(response.body).toHaveProperty('score')
        expect(response.body).toHaveProperty('best')
        expect(response.body).toHaveProperty('worst')
        expect(response.body).toHaveProperty('positiveCount')
        expect(response.body).toHaveProperty('negativeCount')
        expect(response.body).toHaveProperty('neutralCount')
      })

      it('Each count (positive, negative, neutral) should be a positive integer', () => {
        expect(response.body.positiveCount).toBeGreaterThanOrEqual(0)
        expect(response.body.negativeCount).toBeGreaterThanOrEqual(0)
        expect(response.body.neutralCount).toBeGreaterThanOrEqual(0)
      })

      it('Best and worst property should contain a tweet information and score information', () => {
        expect(response.body.best).toHaveProperty('tweet')
        expect(response.body.best.tweet).toHaveProperty('text')
        expect(response.body.best.tweet).toHaveProperty('id')
        expect(response.body.best).toHaveProperty('score')

        expect(response.body.worst).toHaveProperty('tweet')
        expect(response.body.worst.tweet).toHaveProperty('text')
        expect(response.body.worst.tweet).toHaveProperty('id')
        expect(response.body.worst).toHaveProperty('score')

      })
    })

    describe('Negative Test', () => {
      it('It should return 500 as status code when the request is made incorrectly', async () => {
        const response = await request.assertApiRequest(endPointUrl, {}, {expectedStatus: 500})
      })
    })

})
