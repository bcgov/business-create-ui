import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { shallowMount } from '@vue/test-utils'
import { AmlTypes } from '@/enums'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'
import ResultingBusinessName from '@/components/Amalgamation/ResultingBusinessName.vue'

// mock the console.warn function to hide "[Vuetify] Unable to locate target XXX"
// console.warn = vi.fn()

setActivePinia(createPinia())
const store = useStore()

describe('Resulting Business Name component', () => {
  let wrapper: any

  beforeAll(() => {
    wrapper = shallowMount(ResultingBusinessName)
  })

  afterAll(() => {
    wrapper.destroy()
  })

  it('renders the component properly', () => {
    expect(wrapper.find('#resulting-business-name').exists()).toBe(true)
  })

  const FOREIGN = { type: AmlTypes.FOREIGN }
  const CCC = { type: AmlTypes.LEAR, legalType: CorpTypeCd.BC_CCC }
  const BC = { type: AmlTypes.LEAR, legalType: CorpTypeCd.BC_COMPANY }
  const BEN = { type: AmlTypes.LEAR, legalType: CorpTypeCd.BENEFIT_COMPANY }
  const ULC = { type: AmlTypes.LEAR, legalType: CorpTypeCd.BC_ULC_COMPANY }

  const tests = [
    { // variation 0
      amalgamatingBusinesses: [ FOREIGN ],
      computed: []
    },
    { // variation 1
      entityType: CorpTypeCd.BC_CCC,
      amalgamatingBusinesses: [ BC, BEN, CCC, ULC ],
      computed: [ CCC ]
    },
    { // variation 2
      entityType: CorpTypeCd.BC_ULC_COMPANY,
      amalgamatingBusinesses: [ BC, BEN, CCC, ULC ],
      computed: [ ULC ]
    },
    { // variation 3
      entityType: CorpTypeCd.BC_COMPANY,
      amalgamatingBusinesses: [ BC, BEN, CCC, ULC ],
      computed: [ BC, BEN ]
    },
    { // variation 4
      entityType: CorpTypeCd.BENEFIT_COMPANY,
      amalgamatingBusinesses: [ BC, BEN, CCC, ULC ],
      computed: [ BC, BEN ]
    }
  ]

  for (let i = 0; i < tests.length; i++) {
    const test = tests[i]
    it(`correctly filters the list of amalgamating businesses - variation #${i}`, () => {
      // set the entity type
      store.setEntityType(test.entityType || null)
      // set the amalgamating businesses
      store.setAmalgamatingBusinesses(test.amalgamatingBusinesses as any[])
      // verify the computed value
      expect(wrapper.vm.amalgamatingBusinesses).toEqual(test.computed)
    })
  }
})
