import sinon from 'sinon'
import { AxiosInstance as axios } from '@/utils'
import LegalServices from '@/services/legal-services'

describe('Legal Services', () => {
  it('fetches a draft application as a single item', async () => {
    // mock single item response
    sinon.stub(axios, 'get').withArgs('businesses/123/filings')
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
    expect(draft.registration).toHaveProperty('offices')
    expect(draft.registration).toHaveProperty('contactPoint')
    expect(draft.registration).toHaveProperty('parties')

    sinon.restore()
  })

  it('fetches a draft application as the first filing in a list', async () => {
    // mock list response
    sinon.stub(axios, 'get').withArgs('businesses/123/filings')
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

  it('fetches resolutions', async () => {
    // mock list response
    sinon.stub(axios, 'get').withArgs('businesses/123/resolutions')
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

  it.skip('fetches a draft dissolution', async () => {
    // FUTURE
  })

  it.skip('updates a filing', async () => {
    // FUTURE
  })

  it.skip('fetches a name request', async () => {
    // FUTURE
  })
})
