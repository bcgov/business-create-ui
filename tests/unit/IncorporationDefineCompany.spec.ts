import { shallowWrapperFactory } from '../vitest-wrapper-factory'
import DefineCompany from '@/views/Incorporation/IncorporationDefineCompany.vue'

// Test Case Data
const mockEntityInfo = [
  {
    entityType: 'CP'
  },
  {
    entityType: 'BEN'
  },
  {
    entityType: 'BC'
  },
  {
    entityType: 'ULC'
  },
  {
    entityType: 'CC'
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
      expect(wrapper.find('h2').text()).toContain('Name')
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
      expect(wrapper.find('#folio-number-header').text()).toContain('Folio / Reference Number (Optional)')
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
      expect(wrapper.find('h2').text()).toContain('Name')
    })

    it('doesn\'t display folio number when it is not a premium account', () => {
      expect(wrapper.find('#folio-number-header').exists()).toBe(false)
    })
  })
}
