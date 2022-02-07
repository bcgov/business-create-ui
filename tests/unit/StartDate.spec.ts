import { wrapperFactory } from '../jest-wrapper-factory'
import { RegistrationResources } from '@/resources'
import { StartDate } from '@/components/DefineRegistration'

// Test Case Data
const mockEntity = [
  {
    entityType: 'SP',
    initialValue: '2022-02-08'
  },
  {
    entityType: 'GP',
    initialValue: '2022-02-08'
  }
]

for (const mock of mockEntity) {
  describe(`Start Date component for a ${mock.entityType}`, () => {
    let wrapper: any
    const today = new Date()

    beforeEach(() => {
      wrapper = wrapperFactory(
        StartDate,
        {
          initialValue: mock.initialValue
        },
        {
          entityType: mock.entityType,
          currentJsDate: today
        }, null, RegistrationResources)
    })

    afterEach(() => {
      wrapper.destroy()
    })

    it(`renders the component properly`, () => {
      // verify component
      expect(wrapper.find('.section-container').text()).toContain('Start Date')
      expect(wrapper.find('#start-date-selector').exists()).toBe(true)
      expect(wrapper.find('#date-picker').exists()).toBe(true)
    })

    it(`renders the correct initial text`, async () => {
      expect(wrapper.find('#date-picker').text()).toContain('Start Date')
    })

    it(`passes the initial prop value`, async () => {
      expect(wrapper.vm.initialValue).toBe('2022-02-08')
    })

    it(`verifies min start date to be today 2 years in the past`, async () => {
      const mockDate = new Date(today)
      mockDate.setFullYear(mockDate.getFullYear() - 2)

      expect(wrapper.vm.startDateMin).toStrictEqual(mockDate)
    })

    it(`verifies max start date to be today + 90 days in the future`, async () => {
      const mockDate = new Date(today)
      mockDate.setDate(mockDate.getDay() + 90)

      expect(wrapper.vm.startDateMax).toStrictEqual(mockDate)
    })
  })
}
