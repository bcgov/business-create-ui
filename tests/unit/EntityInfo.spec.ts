import { shallowWrapperFactory } from '../vitest-wrapper-factory'
import EntityInfo from '@/components/common/EntityInfo.vue'
import { FilingTypes } from '@/enums'
import { CorpTypeCd } from '@bcrs-shared-components/enums/'
import * as FeatureFlags from '@/utils/feature-flag-utils'

// mock the entire module
// it's the only way to override any exported function
vi.mock('@/utils/feature-flags', () => {
  // we just care about this one function
  return { GetFeatureFlag: vi.fn() }
})

// Test Case Data
const mockEntityInfo = [
  {
    entityType: CorpTypeCd.COOP,
    tombstone: {
      filingType: FilingTypes.INCORPORATION_APPLICATION
    },
    description: 'BC Cooperative Association',
    numberedDesc: 'Numbered Cooperative Association',
    tempId: 'T1234567',
    nameRequest: {
      nrNum: 'NR 1234567'
    },
    nameRequestApprovedName: 'Xyz Ltd.'
  },
  {
    entityType: CorpTypeCd.BENEFIT_COMPANY,
    tombstone: {
      filingType: FilingTypes.INCORPORATION_APPLICATION
    },
    description: 'BC Benefit Company',
    numberedDesc: 'Numbered Benefit Company',
    tempId: 'T1234567',
    nameRequest: {
      nrNum: 'NR 1234567'
    },
    nameRequestApprovedName: 'Xyz Ltd.'
  },
  {
    entityType: CorpTypeCd.BC_COMPANY,
    tombstone: {
      filingType: FilingTypes.INCORPORATION_APPLICATION
    },
    description: 'BC Limited Company',
    numberedDesc: 'Numbered Limited Company',
    tempId: 'T1234567',
    nameRequest: {
      nrNum: 'NR 1234567'
    },
    nameRequestApprovedName: 'Xyz Ltd.'
  },
  {
    entityType: CorpTypeCd.BC_ULC_COMPANY,
    tombstone: {
      filingType: FilingTypes.INCORPORATION_APPLICATION
    },
    description: 'BC Unlimited Liability Company',
    numberedDesc: 'Numbered Unlimited Liability Company',
    tempId: 'T1234567',
    nameRequest: {
      nrNum: 'NR 1234567'
    },
    nameRequestApprovedName: 'Xyz Ltd.'
  },
  {
    entityType: CorpTypeCd.BC_CCC,
    tombstone: {
      filingType: FilingTypes.INCORPORATION_APPLICATION
    },
    description: 'BC Community Contribution Company',
    numberedDesc: '',
    tempId: 'T1234567',
    nameRequest: {
      nrNum: 'NR 1234567'
    },
    nameRequestApprovedName: 'Xyz Ltd.'
  },
  {
    entityType: CorpTypeCd.CONTINUE_IN,
    tombstone: {
      filingType: FilingTypes.CONTINUATION_IN
    },
    description: 'BC Limited Company',
    numberedDesc: '',
    tempId: 'T1234567',
    nameRequest: {
      nrNum: 'NR 1234567'
    },
    nameRequestApprovedName: 'Xyz Ltd.'
  },
  {
    entityType: CorpTypeCd.CONTINUE_IN,
    tombstone: {
      filingType: FilingTypes.CONTINUATION_IN
    },
    description: 'BC Limited Company',
    numberedDesc: 'Numbered Limited Company',
    tempId: 'T1234567',
    nameRequest: {
      nrNum: 'NR 1234567'
    },
    nameRequestApprovedName: 'Xyz Ltd.'
  },
  {
    entityType: CorpTypeCd.BEN_CONTINUE_IN,
    tombstone: {
      filingType: FilingTypes.CONTINUATION_IN
    },
    description: 'BC Benefit Company',
    numberedDesc: '',
    tempId: 'T1234567',
    nameRequest: {
      nrNum: 'NR 1234567'
    },
    nameRequestApprovedName: 'Xyz Ltd.'
  },
  {
    entityType: CorpTypeCd.BEN_CONTINUE_IN,
    tombstone: {
      filingType: FilingTypes.CONTINUATION_IN
    },
    description: 'BC Benefit Company',
    numberedDesc: 'Numbered Benefit Company',
    tempId: 'T1234567',
    nameRequest: {
      nrNum: 'NR 1234567'
    },
    nameRequestApprovedName: 'Xyz Ltd.'
  },
  {
    entityType: CorpTypeCd.CCC_CONTINUE_IN,
    tombstone: {
      filingType: FilingTypes.CONTINUATION_IN
    },
    description: 'BC Community Contribution Company',
    numberedDesc: '',
    tempId: 'T1234567',
    nameRequest: {
      nrNum: 'NR 1234567'
    },
    nameRequestApprovedName: 'Xyz Ltd.'
  },
  {
    entityType: CorpTypeCd.CCC_CONTINUE_IN,
    tombstone: {
      filingType: FilingTypes.CONTINUATION_IN
    },
    description: 'BC Community Contribution Company',
    numberedDesc: 'Numbered Community Contribution Company',
    tempId: 'T1234567',
    nameRequest: {
      nrNum: 'NR 1234567'
    },
    nameRequestApprovedName: 'Xyz Ltd.'
  },
  {
    entityType: CorpTypeCd.ULC_CONTINUE_IN,
    tombstone: {
      filingType: FilingTypes.CONTINUATION_IN
    },
    description: 'BC Unlimited Liability Company',
    numberedDesc: '',
    tempId: 'T1234567',
    nameRequest: {
      nrNum: 'NR 1234567'
    },
    nameRequestApprovedName: 'Xyz Ltd.'
  },
  {
    entityType: CorpTypeCd.ULC_CONTINUE_IN,
    tombstone: {
      filingType: FilingTypes.CONTINUATION_IN
    },
    description: 'BC Unlimited Liability Company',
    numberedDesc: 'Numbered Unlimited Liability Company',
    tempId: 'T1234567',
    nameRequest: {
      nrNum: 'NR 1234567'
    },
    nameRequestApprovedName: 'Xyz Ltd.'
  }
]

for (const mock of mockEntityInfo) {
  describe(`Entity Info component for a ${mock.entityType} with a NR`, () => {
    let wrapper: any

    beforeEach(() => {
      wrapper = shallowWrapperFactory(
        EntityInfo,
        null,
        {
          tombstone: mock.tombstone,
          entityType: mock.entityType,
          tempId: mock.tempId,
          nameRequest: mock.nameRequest,
          nameRequestApprovedName: mock.nameRequestApprovedName
        }
      )
    })

    afterEach(() => {
      wrapper.destroy()
    })

    it('renders the Name Request header', async () => {
      expect(wrapper.vm.$el.querySelector('#entity-legal-name').textContent)
        .toContain('Xyz Ltd.')

      if (mock.tombstone.filingType === FilingTypes.INCORPORATION_APPLICATION) {
        expect(wrapper.vm.$el.querySelector('#entity-description').textContent)
          .toContain(`${mock.description} Incorporation Application`)
      }
      if (mock.tombstone.filingType === FilingTypes.CONTINUATION_IN) {
        expect(wrapper.vm.$el.querySelector('#entity-description').textContent)
          .toContain(`${mock.description} Continuation In Application`)
      }

      expect(wrapper.vm.$el.querySelector('#entity-nr-number').textContent)
        .toContain('NR 1234567')
    })
  })

  describe(`Entity Info component for a ${mock.entityType} without a NR`, () => {
    let wrapper: any

    beforeEach(() => {
      wrapper = shallowWrapperFactory(
        EntityInfo,
        null,
        {
          tombstone: mock.tombstone,
          entityType: mock.entityType,
          tempId: mock.tempId,
          nameRequest: { nrNum: null },
          nameRequestApprovedName: null
        }
      )
    })

    afterEach(() => {
      wrapper.destroy()
    })

    it('renders the Numbered Company header', () => {
      expect(wrapper.vm.$el.querySelector('#entity-legal-name').textContent)
        .toContain(`${mock.numberedDesc}`)

      if (mock.tombstone.filingType === FilingTypes.INCORPORATION_APPLICATION) {
        expect(wrapper.vm.$el.querySelector('#entity-description').textContent)
          .toContain(`${mock.description} Incorporation Application`)
      }
      if (mock.tombstone.filingType === FilingTypes.CONTINUATION_IN) {
        expect(wrapper.vm.$el.querySelector('#entity-description').textContent)
          .toContain(`${mock.description} Continuation In Application`)
      }
    })
  })
}

describe('Entity Info component for firms', () => {
  it('displays NR approved name correctly for a SP registration', () => {
    const wrapper = shallowWrapperFactory(
      EntityInfo,
      null,
      {
        business: { legalName: 'My Legal Name' },
        entityType: CorpTypeCd.SOLE_PROP,
        nameRequestApprovedName: 'My NR Approved Name',
        tombstone: { filingType: FilingTypes.REGISTRATION }
      }
    )

    expect(wrapper.find('#entity-legal-name').text()).toBe('My NR Approved Name')

    wrapper.destroy()
  })

  it('displays alternate name correctly for a SP dissolution - With Legal Name fix', () => {
    vi.spyOn(FeatureFlags, 'GetFeatureFlag').mockImplementation(flag => {
      if (flag === 'enable-legal-name-fix') return true
      return null
    })

    const wrapper = shallowWrapperFactory(
      EntityInfo,
      null,
      {
        business: { legalName: 'My Legal Name' },
        entityType: CorpTypeCd.SOLE_PROP,
        alternateName: 'My Alternate Name',
        tombstone: { filingType: FilingTypes.DISSOLUTION }
      }
    )

    expect(wrapper.find('#entity-legal-name').text()).toBe('My Alternate Name')

    wrapper.destroy()
  })

  it('displays legal name correctly for a SP dissolution - Without Legal Name fix', () => {
    vi.spyOn(FeatureFlags, 'GetFeatureFlag').mockImplementation(flag => {
      if (flag === 'enable-legal-name-fix') return false
      return null
    })

    const wrapper = shallowWrapperFactory(
      EntityInfo,
      null,
      {
        business: { legalName: 'My Legal Name' },
        entityType: CorpTypeCd.SOLE_PROP,
        alternateName: 'My Alternate Name',
        tombstone: { filingType: FilingTypes.DISSOLUTION }
      }
    )

    expect(wrapper.find('#entity-legal-name').text()).toBe('My Legal Name')

    wrapper.destroy()
  })
})
