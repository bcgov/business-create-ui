import sinon from 'sinon'
import { axios } from '@/utils'
import LegalServices from '@/services/legal.services'

// draft registration filing
const draftRegistration = {
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

describe('Legal Services', () => {
  it('fetches a draft application as a single item', async () => {
    // mock single item response
    sinon.stub(axios, 'get').withArgs('businesses/123/filings')
      .returns(new Promise(resolve => resolve({
        data: { filing: draftRegistration }
      })))

    // fetch draft and check it
    const draft: any = await LegalServices.fetchDraftApplication('123')
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
        data: { filings: [{ filing: draftRegistration }] }
      })))

    // fetch draft and check it
    const draft: any = await LegalServices.fetchDraftApplication('123')
    expect(draft).not.toBeFalsy()
    expect(draft).toHaveProperty('header')
    expect(draft).toHaveProperty('registration')
    expect(draft.registration).toHaveProperty('offices')
    expect(draft.registration).toHaveProperty('contactPoint')
    expect(draft.registration).toHaveProperty('parties')

    sinon.restore()
  })

  xit('fetches a draft dissolution', async () => {
    // FUTURE
  })

  xit('updates a filing', async () => {
    // FUTURE
  })

  xit('fetches a name request', async () => {
    // FUTURE
  })
})
