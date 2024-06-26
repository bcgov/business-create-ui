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
  const BC = { type: AmlTypes.LEAR, legalType: CorpTypeCd.BC_COMPANY }
  const BEN = { type: AmlTypes.LEAR, legalType: CorpTypeCd.BENEFIT_COMPANY }
  const C = { type: AmlTypes.LEAR, legalType: CorpTypeCd.CONTINUE_IN }
  const CBEN = { type: AmlTypes.LEAR, legalType: CorpTypeCd.BEN_CONTINUE_IN }
  const CC = { type: AmlTypes.LEAR, legalType: CorpTypeCd.BC_CCC }
  const CCC = { type: AmlTypes.LEAR, legalType: CorpTypeCd.CCC_CONTINUE_IN }
  const CUL = { type: AmlTypes.LEAR, legalType: CorpTypeCd.ULC_CONTINUE_IN }
  const ULC = { type: AmlTypes.LEAR, legalType: CorpTypeCd.BC_ULC_COMPANY }

  const tests = [
    { // variation 0
      amalgamatingBusinesses: [ FOREIGN ],
      computed: []
    },
    { // variation 1
      entityType: CorpTypeCd.BC_COMPANY,
      amalgamatingBusinesses: [ BC, BEN, C, CBEN, CC, CCC, CUL, ULC ],
      computed: [ BC, BEN, C, CBEN ]
    },
    { // variation 2
      entityType: CorpTypeCd.BENEFIT_COMPANY,
      amalgamatingBusinesses: [ BC, BEN, C, CBEN, CC, CCC, CUL, ULC ],
      computed: [ BC, BEN, C, CBEN ]
    },
    { // variation 3
      entityType: CorpTypeCd.CONTINUE_IN,
      amalgamatingBusinesses: [ BC, BEN, C, CBEN, CC, CCC, CUL, ULC ],
      computed: [ BC, BEN, C, CBEN ]
    },
    { // variation 4
      entityType: CorpTypeCd.BEN_CONTINUE_IN,
      amalgamatingBusinesses: [ BC, BEN, C, CBEN, CC, CCC, CUL, ULC ],
      computed: [ BC, BEN, C, CBEN ]
    },
    { // variation 5
      entityType: CorpTypeCd.BC_CCC,
      amalgamatingBusinesses: [ BC, BEN, C, CBEN, CC, CCC, CUL, ULC ],
      computed: [ CC, CCC ]
    },
    { // variation 6
      entityType: CorpTypeCd.CCC_CONTINUE_IN,
      amalgamatingBusinesses: [ BC, BEN, C, CBEN, CC, CCC, CUL, ULC ],
      computed: [ CC, CCC ]
    },
    { // variation 7
      entityType: CorpTypeCd.ULC_CONTINUE_IN,
      amalgamatingBusinesses: [ BC, BEN, C, CBEN, CC, CCC, CUL, ULC ],
      computed: [ CUL, ULC ]
    },
    { // variation 8
      entityType: CorpTypeCd.BC_ULC_COMPANY,
      amalgamatingBusinesses: [ BC, BEN, C, CBEN, CC, CCC, CUL, ULC ],
      computed: [ CUL, ULC ]
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
