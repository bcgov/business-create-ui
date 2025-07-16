import sinon from 'sinon'
import LegalServices from '@/services/legal-services'
import * as FeatureFlags from '@/utils/feature-flag-utils'
import { AxiosInstance as axios } from '@/utils'

// Populate session variables
sessionStorage.setItem('BUSINESS_API_GW_URL', 'https://business-api-gw.url/')

// Mock feature flag
vi.spyOn(FeatureFlags, 'GetFeatureFlag').mockImplementation(flag => {
  if (flag === 'use-business-api-gw-url') return true
  return null
})

describe('Legal Services', () => {
  it.skip('fetches the filings list', async () => {
    // FUTURE
  })

  it('fetches the only filing', async () => {
    // mock single item response
    sinon.stub(axios, 'get').withArgs('https://business-api-gw.url/businesses/123/filings')
      .returns(new Promise(resolve => resolve({
        data: {
          filing: {
            header: {
              name: 'registration',
              filingId: 123
            },
            registration: {
              offices: [],
              contactPoint: {},
              parties: []
            }
          }
        }
      })))

    // fetch draft and check it
    const draft: any = await LegalServices.fetchFirstOrOnlyFiling('123')
    expect(draft).not.toBeFalsy()
    expect(draft).toHaveProperty('header')
    expect(draft).toHaveProperty('registration')
    expect(draft.header).toHaveProperty('name')
    expect(draft.header).toHaveProperty('filingId')
    expect(draft.registration).toHaveProperty('offices')
    expect(draft.registration).toHaveProperty('contactPoint')
    expect(draft.registration).toHaveProperty('parties')

    sinon.restore()
  })

  it('fetches the first filing', async () => {
    // mock list response
    sinon.stub(axios, 'get').withArgs('https://business-api-gw.url/businesses/123/filings')
      .returns(new Promise(resolve => resolve({
        data: {
          filings: [
            {
              name: 'registration',
              filingId: 123
            }
          ]
        }
      })))

    // fetch draft and check it
    const draft: any = await LegalServices.fetchFirstOrOnlyFiling('123')
    expect(draft).not.toBeFalsy()
    expect(draft).toHaveProperty('name')
    expect(draft).toHaveProperty('filingId')

    sinon.restore()
  })

  it.skip('fetches the first task', async () => {
    // FUTURE
  })

  it.skip('fetches a filing from its url', async () => {
    // FUTURE
  })

  it.skip('updates an existing filing', async () => {
    // FUTURE
  })

  it.skip('fetches a name request', async () => {
    // FUTURE
  })

  it.skip('fetches parties', async () => {
    // FUTURE
  })

  it.skip('fetches directors', async () => {
    // FUTURE
  })

  it.skip('fetches share structure', async () => {
    // FUTURE
  })

  it('fetches resolutions', async () => {
    // mock list response
    sinon.stub(axios, 'get').withArgs('https://business-api-gw.url/businesses/123/resolutions')
      .returns(new Promise(resolve => resolve({
        data: {
          resolutions: [
            {
              date: '2024-07-15',
              id: 123456,
              type: 'SPECIAL'
            },
            {
              date: '2024-07-16',
              id: 123457,
              type: 'SPECIAL'
            }
          ]
        }
      })))

    // fetch resolutions and check it
    const response: any = await LegalServices.fetchResolutions('123')
    expect(response.length).toEqual(2)
    expect(response.at(0)).toHaveProperty('date')
    expect(response.at(0)).toHaveProperty('type')

    sinon.restore()
  })

  it.skip('fetches addresses', async () => {
    // FUTURE
  })

  it.skip('fetches business info', async () => {
    // FUTURE
  })

  it.skip('fetches authorized actions', async () => {
    // FUTURE
  })

  it.skip('gets a pre-signed URL', async () => {
    // FUTURE
  })

  it.skip('uploads a file to URL', async () => {
    // FUTURE
  })

  it.skip('deletes a document', async () => {
    // FUTURE
  })

  it.skip('downloads a document', async () => {
    // FUTURE
  })
})
