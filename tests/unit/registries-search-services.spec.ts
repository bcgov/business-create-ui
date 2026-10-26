import { AxiosInstance as axios } from '@/utils'
import sinon from 'sinon'
import RegistriesSearchServices from '@/services/registries-search-services'

describe('Registries Search Services', () => {
  const url = 'https://search.api.url/search/businesses'
  const legalTypes = 'BC,A,ULC,C,S,XP,GP,LP,CUL,XS,LLC,LL,BEN,CP,CC,XL,FI,XCP,PA'

  beforeAll(() => {
    sessionStorage.setItem('REGISTRIES_SEARCH_API_URL', 'https://search.api.url/')
  })

  afterEach(() => {
    sinon.restore()
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
    sinon.stub(axios, 'post')
      .withArgs(url, {
        query: { value: 'FM1000002' },
        categories: { legalType: legalTypes.split(','), status: ['ACTIVE'] },
        start: 0,
        rows: 20
      })
      .resolves({ data: { searchResults: { results: [result] } } })

    // search and look at results
    const results = await RegistriesSearchServices.search('FM1000002', 'ACTIVE', legalTypes)
    expect(results.length).toBe(1)
    expect(results[0]).toEqual(result)
  })

  it('does not return a result when the business is not found', async () => {
    // mock unsuccesssful search
    sinon.stub(axios, 'post')
      .withArgs(url, {
        query: { value: 'FM1000003' },
        categories: { legalType: legalTypes.split(','), status: ['ACTIVE'] },
        start: 0,
        rows: 20
      })
      .resolves({ data: { searchResults: { results: [] } } })

    // search and look at results
    const results = await RegistriesSearchServices.search('FM1000003', 'ACTIVE', legalTypes)
    expect(results.length).toBe(0)
  })

  it('searches a single legal type (extraprovincial lookup)', async () => {
    const result = { identifier: 'A1234567', legalType: 'A', name: 'XPRO CORP', status: 'ACTIVE' }

    sinon.stub(axios, 'post')
      .withArgs(url, {
        query: { value: 'XPRO' },
        categories: { legalType: ['A'], status: ['ACTIVE'] },
        start: 0,
        rows: 20
      })
      .resolves({ data: { searchResults: { results: [result] } } })

    const results = await RegistriesSearchServices.search('XPRO', 'ACTIVE', 'A')
    expect(results).toEqual([result])
  })

  it('omits the status category when status is empty', async () => {
    const result = { identifier: 'BC1234567', legalType: 'BC', name: 'OLD CORP', status: 'HISTORICAL' }

    sinon.stub(axios, 'post')
      .withArgs(url, {
        query: { value: 'OLD' },
        categories: { legalType: ['BC'] },
        start: 0,
        rows: 20
      })
      .resolves({ data: { searchResults: { results: [result] } } })

    const results = await RegistriesSearchServices.search('OLD', '', 'BC')
    expect(results).toEqual([result])
  })

  it('throws when the API response is invalid', async () => {
    sinon.stub(axios, 'post').resolves({ data: {} })

    await expect(RegistriesSearchServices.search('CORP', 'ACTIVE', 'BC')).rejects.toThrow('Invalid API response')
  })
})
