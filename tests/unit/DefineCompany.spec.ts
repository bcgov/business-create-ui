import { shallowWrapperFactory } from '../jest-wrapper-factory'
import DefineCompany from '@/views/DefineCompany.vue'

// Test Case Data
const mockEntityInfo = [
  {
    entityType: 'CP',
    description: ''
  },
  {
    entityType: 'BEN',
    description: `This company is a benefit company and, as such, has purposes that include conducting its business
        in a responsible and sustainable manner and promoting one or more public benefits.`
  },
  {
    entityType: 'BC',
    description: ''
  },
  {
    entityType: 'ULC',
    description: `The shareholders of this company are jointly and severally liable to satisfy the debts and liabilities
    of this company to the extent provided in section 51.3 of the Business Corporations Act.`
  },
  {
    entityType: 'CC',
    description: `This company is a community contribution company, and, as such, has purposes beneficial to society.
    This company is restricted, in accordance with Part 2.2 of the BCA, in its ability to pay dividends and to
    distribute its assets on dissolution or otherwise.`
  }
]

// Conditional check for specific test scenarios
const itIf = (condition) => condition ? it : it.skip

for (const mock of mockEntityInfo) {
  describe(`Define Company view for a Premium ${mock.entityType}`, () => {
    let wrapper: any

    beforeEach(() => {
      wrapper = shallowWrapperFactory(DefineCompany, null, {
        entityType: mock.entityType,
        accountInformation: {
          accountType: 'PREMIUM'
        }
      })
    })

    afterEach(() => {
      wrapper.destroy()
    })

    it(`renders the component properly for a ${mock.entityType}`, () => {
      // verify page content
      expect(wrapper.find('h2').text()).toContain('Company Name')
    })

    // eslint-disable-next-line max-len
    itIf(mock.entityType === 'CP')('doesn\'t display records office in the office address header when entity is a COOP', () => {
      expect(wrapper.vm.$el.querySelector('#office-address-header').textContent).not.toContain('Records')
    })

    // eslint-disable-next-line max-len
    itIf(['BEN', 'ULC', 'CCC'].includes(mock.entityType))('displays records office in the office address header', () => {
      expect(wrapper.vm.$el.querySelector('#office-address-header').textContent).toContain('Records')
    })

    it('displays folio number when it is a premium account', () => {
      expect(wrapper.find('#folio-number-header').exists()).toBe(true)
      expect(wrapper.find('#folio-number-header').text()).toContain('Folio / Reference Number (optional)')
    })

    itIf(['BEN', 'ULC', 'CCC'].includes(mock.entityType))('displays company statement', () => {
      expect(wrapper.find('.company-statement').exists()).toBe(true)
      expect(wrapper.find('.company-statement p').text()).toContain(mock.description)
    })
  })

  describe(`Define Company view for a Basic ${mock.entityType}`, () => {
    let wrapper: any

    beforeEach(() => {
      wrapper = shallowWrapperFactory(DefineCompany, null, {
        entityType: mock.entityType,
        accountInformation: {
          accountType: 'BASIC'
        }
      })
    })

    afterEach(() => {
      wrapper.destroy()
    })

    it(`renders the component properly for a ${mock.entityType}`, () => {
      // verify page content
      expect(wrapper.find('h2').text()).toContain('Company Name')
    })

    it('doesn\'t display folio number when it is not a premium account', () => {
      expect(wrapper.find('#folio-number-header').exists()).toBe(false)
    })
  })
}
