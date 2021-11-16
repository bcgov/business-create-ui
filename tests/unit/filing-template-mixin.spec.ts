import { wrapperFactory } from '../jest-wrapper-factory'
import MixinTester from './mixin-tester.vue'

describe('COOP filing data', () => {
  // load coop filing data
  const COOP_IA = require('./test-data/incorpAppCoop.json')
  let wrapper: any

  beforeEach(() => {
    wrapper = wrapperFactory(MixinTester, null, {})
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('no name translations for a coop IA', () => {
    wrapper.vm.parseIncorporationsDraft(COOP_IA.filing)

    // no name translation input
    expect(wrapper.vm.getNameTranslations.length).toBe(0)

    // after building filing data, the name translations should be empty as well
    const filing = wrapper.vm.buildIncorporationFiling()
    expect(filing.incorporationApplication.nameTranslations.length).toBe(0)
  })
})
