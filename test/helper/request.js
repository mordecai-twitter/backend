const server = require('../../index.js')
const supertest = require('supertest')
const request = supertest(server);

function mapToQueryString(obj) {
	return Object.keys(obj).map((key) => `${key}=${encodeURIComponent(obj[key])}`).join('&');
}

async function assertRequest(url, query = {}, {expectedStatus, expectedContentType, expectedBodyType} = {}) {
  const queryString = mapToQueryString(query)
  const urlRequest = url +'?'+ queryString

  const response = await request.get(urlRequest);

  const status = response.status
  const contentType = response.type
  const body = response.body

	if(expectedStatus && status != expectedStatus)
		console.log("Status not as expected, response: ", response)

  if(expectedStatus)
    expect(status).toBe(expectedStatus)
  if(expectedContentType)
    expect(contentType).toBe(expectedContentType)
  if(expectedBodyType)
    expect(body).toBeInstanceOf(expectedBodyType)

  return {response, body, status, contentType}
}

async function assertApiRequest(url, query, expected = {}) {
  const apiUrl = '/api/' + url
  expected.expectedContentType = expected.expectedContentType || 'application/json'
  return assertRequest(apiUrl, query, expected)
}

module.exports = {
  assertRequest,
  assertApiRequest
}
