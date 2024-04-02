import { shallowWrapperFactory, wrapperFactory } from '../vitest-wrapper-factory'
import EntityInfo from '@/components/common/EntityInfo.vue'
import { FilingTypes } from '@/enums'
import { CorpTypeCd } from '@bcrs-shared-components/enums/'

// Test Case Data
const mockEntityInfo = [
  {
    entityType: 'CP',
    tombstone: {
      filingType: 'incorporationApplication'
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
    entityType: 'BEN',
    tombstone: {
      filingType: 'incorporationApplication'
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
    entityType: 'BC',
    tombstone: {
      filingType: 'incorporationApplication'
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
    entityType: 'ULC',
    tombstone: {
      filingType: 'incorporationApplication'
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
    entityType: 'CC',
    tombstone: {
      filingType: 'incorporationApplication'
    },
    description: 'BC Community Contribution Company',
    numberedDesc: '',
    tempId: 'T1234567',
    nameRequest: {
      nrNum: 'NR 1234567'
    },
    nameRequestApprovedName: 'Xyz Ltd.'
  }
]

//
// FUTURE: These tests generate a lot of
// "UnhandledPromiseRejectionWarning:NavigationDuplicated"
// and
// "UnhandledPromiseRejectionWarning: Unhandled promise rejection"
// warnings, which should be cleaned up.
//
for (const mock of mockEntityInfo) {
  describe(`Entity Info component for a ${mock.entityType} with a NR`, () => {
    let wrapper: any

    beforeEach(() => {
      wrapper = wrapperFactory(EntityInfo, null, {
        tombstone: mock.tombstone,
        entityType: mock.entityType,
        tempId: mock.tempId,
        nameRequest: mock.nameRequest,
        nameRequestApprovedName: mock.nameRequestApprovedName
      }, 'incorporation-define-company')
    })

    afterEach(() => {
      wrapper.destroy()
    })

    it('renders the Name Request header', async () => {
      expect(wrapper.vm.$el.querySelector('#entity-legal-name').textContent)
        .toContain('Xyz Ltd.')

      expect(wrapper.vm.$el.querySelector('#entity-description').textContent)
        .toContain(`${mock.description} Incorporation Application`)

      expect(wrapper.vm.$el.querySelector('#entity-nr-number').textContent)
        .toContain('NR 1234567')
    })
  })

  describe(`Entity Info component for a ${mock.entityType} without a NR`, () => {
    let wrapper: any

    beforeEach(() => {
      wrapper = wrapperFactory(EntityInfo, null, {
        tombstone: mock.tombstone,
        entityType: mock.entityType,
        tempId: mock.tempId,
        nameRequest: { nrNum: null },
        nameRequestApprovedName: null
      }, 'incorporation-define-company')
    })

    afterEach(() => {
      wrapper.destroy()
    })

    it('renders the Numbered Company header', () => {
      expect(wrapper.vm.$el.querySelector('#entity-legal-name').textContent)
        .toContain(`${mock.numberedDesc}`)

      expect(wrapper.vm.$el.querySelector('#entity-description').textContent)
        .toContain(`${mock.description} Incorporation Application`)
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

  it('displays operating name correctly for a SP dissolution', () => {
    const wrapper = shallowWrapperFactory(
      EntityInfo,
      null,
      {
        business: { legalName: 'My Legal Name' },
        entityType: CorpTypeCd.SOLE_PROP,
        alternateName: 'My Operating Name',
        tombstone: { filingType: FilingTypes.DISSOLUTION }
      }
    )

    expect(wrapper.find('#entity-legal-name').text()).toBe('My Operating Name')

    wrapper.destroy()
  })
})
