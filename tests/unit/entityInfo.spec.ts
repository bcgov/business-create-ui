import { wrapperFactory } from '../jest-wrapper-factory'
import { EntityInfo } from '@/components/common'

// Test Case Data
const mockEntityInfo = [
  {
    entityType: 'CP',
    description: 'BC Cooperative Association',
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
    description: 'BC Benefit Company',
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
    description: 'BC Limited Company',
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
    description: 'BC Unlimited Liability Company',
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
    description: 'BC Community Contribution Company',
    tempId: 'T1234567',
    nameRequest: {
      nrNumber: 'NR 1234567',
      details: {
        approvedName: 'Xyz Ltd.'
      }
    }
  }
]

for (const mock of mockEntityInfo) {
  describe(`Entity Info component with an NR for a ${mock.entityType}`, () => {
    let wrapper: any

    beforeEach(() => {
      wrapper = wrapperFactory(EntityInfo, null, {
        entityType: mock.entityType,
        tempId: mock.tempId,
        nameRequest: mock.nameRequest
      })
    })

    it(`renders the Name Request header when the EntityType(${mock.entityType}) is present`, async () => {
      expect(wrapper.vm.$el.querySelector('#nr-header').textContent)
        .toContain(`${mock.description} Incorporation Application`)

      expect(wrapper.vm.$el.querySelector('#entity-legal-name').textContent)
        .toContain('Xyz Ltd.')

      expect(wrapper.vm.$el.querySelector('#entity-nr-number').textContent)
        .toContain('NR 1234567')
    })

    it('displays the breadcrumb correctly as a named benefit company', async () => {
      const breadcrumbs = wrapper.findAll('.v-breadcrumbs li')

      const crumb1 = breadcrumbs.at(0)
      const divider = breadcrumbs.at(1)// Divider is present every odd index
      const crumb2 = breadcrumbs.at(2)
      const crumb3 = breadcrumbs.at(4)

      expect(crumb1.text()).toStrictEqual('Manage Businesses Dashboard')
      expect(divider.text()).toStrictEqual('>')
      expect(crumb2.text()).toStrictEqual('Xyz Ltd.')
      expect(crumb3.text()).toStrictEqual(`${mock.description} Incorporation Application`)
    })
  })

  describe(`Entity Info component without an NR for a ${mock.entityType}`, () => {
    let wrapper: any

    beforeEach(() => {
      wrapper = wrapperFactory(EntityInfo, null, {
        entityType: mock.entityType,
        tempId: mock.tempId,
        nameRequest: {
          nrNumber: null,
          details: {
            approvedName: null
          }
        }
      })
    })

    it(`renders the Numbered Company header when the EntityType(${mock.entityType}) is present with no NR`,
      async () => {
        expect(wrapper.vm.$el.querySelector('#nr-header').textContent)
          .toContain(`${mock.description} Incorporation Application`)

        expect(wrapper.vm.$el.querySelector('#entity-legal-name').textContent)
          .toContain(`Numbered ${mock.description}`)

        expect(wrapper.vm.$el.querySelector('#entity-numbered-label').textContent)
          .toContain(`Numbered ${mock.description}`)
      })

    it('displays the breadcrumb correctly as a numbered benefit company', async () => {
      const breadcrumbs = wrapper.findAll('.v-breadcrumbs li')

      const crumb1 = breadcrumbs.at(0)
      const divider = breadcrumbs.at(1)// Divider is present every odd index
      const crumb2 = breadcrumbs.at(2)
      const crumb3 = breadcrumbs.at(4)

      expect(crumb1.text()).toStrictEqual('Manage Businesses Dashboard')
      expect(divider.text()).toStrictEqual('>')
      expect(crumb2.text()).toStrictEqual(`Numbered ${mock.description}`)
      expect(crumb3.text()).toStrictEqual(`${mock.description} Incorporation Application`)
    })
  })
}
