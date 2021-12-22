import { wrapperFactory } from '../jest-wrapper-factory'
import EntityInfo from '@/components/common/EntityInfo.vue'

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
      nrNumber: 'NR 1234567',
      details: {
        approvedName: 'Xyz Ltd.'
      }
    }
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
      nrNumber: 'NR 1234567',
      details: {
        approvedName: 'Xyz Ltd.'
      }
    }
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
      nrNumber: 'NR 1234567',
      details: {
        approvedName: 'Xyz Ltd.'
      }
    }
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
      nrNumber: 'NR 1234567',
      details: {
        approvedName: 'Xyz Ltd.'
      }
    }
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
      nrNumber: 'NR 1234567',
      details: {
        approvedName: 'Xyz Ltd.'
      }
    }
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
  describe(`Entity Info component with an NR for a ${mock.entityType}`, () => {
    let wrapper: any

    beforeEach(() => {
      wrapper = wrapperFactory(EntityInfo, null, {
        tombstone: mock.tombstone,
        entityType: mock.entityType,
        tempId: mock.tempId,
        nameRequest: mock.nameRequest
      }, 'define-company')
    })

    it(`renders the Name Request header when the EntityType(${mock.entityType}) is present`, async () => {
      expect(wrapper.vm.$el.querySelector('#entity-legal-name').textContent)
        .toContain('Xyz Ltd.')

      expect(wrapper.vm.$el.querySelector('#entity-title').textContent)
        .toContain(`${mock.description} Incorporation Application`)

      expect(wrapper.vm.$el.querySelector('#entity-nr-number').textContent)
        .toContain('NR 1234567')
    })
  })

  describe(`Entity Info component without an NR for a ${mock.entityType}`, () => {
    let wrapper: any

    beforeEach(() => {
      wrapper = wrapperFactory(EntityInfo, null, {
        tombstone: mock.tombstone,
        entityType: mock.entityType,
        tempId: mock.tempId,
        nameRequest: {
          nrNumber: null,
          details: {
            approvedName: null
          }
        }
      }, 'define-company')
    })

    it(`renders the Numbered Company header when the EntityType(${mock.entityType}) is present with no NR`,
      async () => {
        expect(wrapper.vm.$el.querySelector('#entity-legal-name').textContent)
          .toContain(`${mock.numberedDesc}`)

        expect(wrapper.vm.$el.querySelector('#entity-title').textContent)
          .toContain(`${mock.description} Incorporation Application`)
      })
  })
}
