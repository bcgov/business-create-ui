import { shallowWrapperFactory } from '../jest-wrapper-factory'
import { DocumentDelivery } from '@/components/ReviewConfirm'

// Test Case Data
const documentDeliveryCases = [
  {
    entityType: 'CP',
    tombstone: {
      userEmail: 'mockCPCompletingParty@email.com'
    },
    defineCompanyStep: {
      businessContact: {
        email: 'mockCPBusinessContact@email.com'
      }
    }
  },
  {
    entityType: 'BEN',
    tombstone: {
      userEmail: 'BENCompletingParty@email.com'
    },
    defineCompanyStep: {
      businessContact: {
        email: 'BENBusinessContact@email.com'
      }
    }
  }
]

for (const mock of documentDeliveryCases) {
  describe(`Document Delivery component for a ${mock.entityType}`, () => {
    let wrapper: any

    it('renders the component properly', () => {
      wrapper = shallowWrapperFactory(DocumentDelivery, null, { entityType: mock.entityType })
      expect(wrapper.find('#document-delivery').exists()).toBe(true)
    })

    it('displays email labels', () => {
      wrapper = shallowWrapperFactory(DocumentDelivery, null, { entityType: mock.entityType })
      expect(wrapper.findAll('label').at(0).text()).toBe('Registered Office')
      expect(wrapper.findAll('label').at(1).text()).toBe('Completing Party')
    })

    it('displays email computed values', () => {
      wrapper = shallowWrapperFactory(DocumentDelivery, null, {
        entityType: mock.entityType,
        tombstone: mock.tombstone,
        defineCompanyStep: mock.defineCompanyStep
      })
      expect(wrapper.find('#completing-party-email').text()).toBe(mock.tombstone.userEmail)
      expect(wrapper.find('#office-email').text()).toBe(mock.defineCompanyStep.businessContact.email)
    })

    it('displays Not Entered text when computed values are absent', () => {
      mock.tombstone.userEmail = ''
      mock.defineCompanyStep.businessContact.email = ''

      wrapper = shallowWrapperFactory(DocumentDelivery, null, {
        entityType: mock.entityType,
        tombstone: mock.tombstone,
        defineCompanyStep: mock.defineCompanyStep
      })
      expect(wrapper.find('#completing-party-email').text()).toBe('Not entered')
      expect(wrapper.find('#office-email').text()).toBe('Not entered')
    })
  })
}
