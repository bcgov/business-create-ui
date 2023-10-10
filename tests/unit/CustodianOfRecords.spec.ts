import Vue from 'vue'
import { shallowWrapperFactory } from '../vitest-wrapper-factory'
import CustodianOfRecords from '@/components/Dissolution/CustodianOfRecords.vue'
import { DissolutionResources } from '@/resources'
import { PartyTypes } from '@/enums'

// Test Case Data
const custodianTestCases = [
  {
    entityType: 'CP',
    custodianTitle: 'Custodian of Records',
    hasPersonOnly: true,
    hasPersonOrOrg: false,
    partyType: PartyTypes.PERSON,
    mailingAddress: {
      addressCity: 'MockVille',
      addressCountry: 'CA',
      addressRegion: 'BC',
      postalCode: 'v1v 1v1',
      streetAddress: '123 Mock Ave'
    },
    inheritMailingAddress: false
  },
  {
    entityType: 'BEN',
    custodianTitle: 'Custodian of Records',
    hasPersonOnly: false,
    hasPersonOrOrg: true,
    partyType: PartyTypes.PERSON,
    mailingAddress: {
      addressCity: 'MockVille',
      addressCountry: 'CA',
      addressRegion: 'BC',
      postalCode: 'v1v 1v1',
      streetAddress: '123 Mock Ave'
    },
    inheritMailingAddress: false
  },
  {
    entityType: 'BC',
    custodianTitle: 'Custodian of Records',
    hasPersonOnly: false,
    hasPersonOrOrg: true,
    partyType: PartyTypes.PERSON,
    mailingAddress: {
      addressCity: 'MockVille',
      addressCountry: 'CA',
      addressRegion: 'BC',
      postalCode: 'v1v 1v1',
      streetAddress: '123 Mock Ave'
    },
    inheritMailingAddress: false
  }
]

for (const mock of custodianTestCases) {
  describe(`Custodian of Records component for a ${mock.entityType}`, () => {
    let wrapper: any

    beforeEach(() => {
      wrapper = shallowWrapperFactory(
        CustodianOfRecords,
        null,
        {
          entityType: mock.entityType,
          dissolution: {
            custodianOfRecords: {
              custodian: {
                officer: {
                  partyType: mock.partyType
                },
                mailingAddress: mock.mailingAddress,
                inheritMailingAddress: mock.inheritMailingAddress
              }
            }
          }
        },
        null,
        DissolutionResources
      )
    })

    it('renders the component properly', () => {
      expect(wrapper.find('#custodian-of-records').exists()).toBe(true)
    })

    it('displays custodian title and section subtitle', () => {
      expect(wrapper.find('label').text()).toBe(mock.custodianTitle)
    })

    it('displays or hides the person input fields', () => {
      expect(wrapper.find('#person-input').exists()).toBe(mock.hasPersonOnly)
    })

    it('displays or hides the org or person radio buttons and input fields', () => {
      expect(wrapper.find('.person-or-org-radio-group').exists()).toBe(mock.hasPersonOrOrg)
    })

    it('hides the summary section by default', () => {
      expect(wrapper.find('.summary-section').exists()).toBe(false)
    })

    it('shows the summary section when the isSummary prop is true', async () => {
      await wrapper.setProps({ isSummary: true })
      expect(wrapper.find('.summary-section').exists()).toBe(true)
    })

    it('sets the delivery address to be the same as mailing when selected', async () => {
      // Verify Store values
      expect(wrapper.vm.custodian.mailingAddress).toBe(mock.mailingAddress)
      expect(wrapper.vm.custodian.deliveryAddress).toBeUndefined()
      expect(wrapper.vm.custodian.inheritMailingAddress).toBe(false)

      // Set inherit
      wrapper.vm.custodian.inheritMailingAddress = true
      await Vue.nextTick()

      expect(wrapper.vm.custodian.inheritMailingAddress).toBe(true)
      expect(wrapper.vm.custodian.deliveryAddress).toEqual(mock.mailingAddress)

      // Unset the inherit
      wrapper.vm.custodian.inheritMailingAddress = false
      await Vue.nextTick()

      // Verify Store values
      expect(wrapper.vm.custodian.mailingAddress).toBe(mock.mailingAddress)
      expect(wrapper.vm.custodian.deliveryAddress).toEqual(wrapper.vm.defaultAddress)
      expect(wrapper.vm.custodian.inheritMailingAddress).toBe(false)
    })
  })
}
