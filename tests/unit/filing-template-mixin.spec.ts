import { wrapperFactory } from '../jest-wrapper-factory'
import MixinTester from './mixin-tester.vue'

// get coop filing data

describe('COOP filing data', () => {
  const COOP_DRAFT_FILING = require('./test-data/coopDraftFiling.json')
  let vm: any

  beforeEach(() => {
    const wrapper = wrapperFactory(MixinTester, null, {})
    vm = wrapper.vm
  })

  it('no name translations for a coop IA', () => {
    vm.parseIncorporationsDraft(COOP_DRAFT_FILING.filing)
    vm.buildIncorporationFiling()
    expect(vm.getNameTranslations.length).toBe(0)
  })
})
