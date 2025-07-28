import { AxiosInstance as axios } from '@/utils'
import sinon from 'sinon'
import RegistriesSearchServices from '@/services/registries-search-services'

describe('Business Lookup Services', () => {
  beforeAll(() => {
    sessionStorage.setItem('REGISTRIES_SEARCH_API_URL', 'https://search.api.url/')
  })

  it('returns a result when the business is found', async () => {
    const result = {
      bn: '701819922',
      identifier: 'FM1000002',
      legalType: 'SP',
      name: 'KK CONSTRUCTION',
      score: 10.642771,
      status: 'ACTIVE'
    }

    // mock successsful search
    sinon.stub(axios, 'get')
      .withArgs('https://search.api.url/businesses/search/facets?start=0&rows=20&categories=legalType:' +
        'BC,A,ULC,C,S,XP,GP,LP,CUL,XS,LLC,LL,BEN,CP,CC,XL,FI,XCP,PA::status:ACTIVE&query=value:FM1000002')
      .resolves({ data: { searchResults: { results: [result] } } })

    // search and look at results
    const results = await RegistriesSearchServices.search(
      'FM1000002', 'ACTIVE', 'BC,A,ULC,C,S,XP,GP,LP,CUL,XS,LLC,LL,BEN,CP,CC,XL,FI,XCP,PA'
    )
    expect(results.length).toBe(1)
    expect(results[0]).toEqual(result)

    sinon.restore()
  })

  it('does not return a result when the business is not found', async () => {
    // mock unsuccesssful search
    sinon.stub(axios, 'get')
      .withArgs('https://search.api.url/businesses/search/facets?start=0&rows=20&categories=legalType' +
        ':BC,A,ULC,C,S,XP,GP,LP,CUL,XS,LLC,LL,BEN,CP,CC,XL,FI,XCP,PA::status:ACTIVE&query=value:FM1000003')
      .resolves({ data: { searchResults: { results: [] } } })

    // search and look at results
    const results = await RegistriesSearchServices.search(
      'FM1000003', 'ACTIVE', 'BC,A,ULC,C,S,XP,GP,LP,CUL,XS,LLC,LL,BEN,CP,CC,XL,FI,XCP,PA'
    )
    expect(results.length).toBe(0)

    sinon.restore()
  })
})
