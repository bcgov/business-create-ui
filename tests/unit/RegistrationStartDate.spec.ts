import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import StartDate from '@/components/Registration/StartDate.vue'
import { AuthorizationRoles } from '@/enums'

const vuetify = new Vuetify({})

setActivePinia(createPinia())
const store = useStore()

describe('Start Date component', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(StartDate, { vuetify })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the component properly', () => {
    // verify component
    expect(wrapper.find('.start-date-title').text()).toBe('Start Date')
    expect(wrapper.find('#start-date-selector').exists()).toBe(true)
    expect(wrapper.find('#date-picker').exists()).toBe(true)
  })

  it('renders the correct initial text', async () => {
    expect(wrapper.find('#date-picker').text()).toContain('Start Date')
  })

  it('has correct minimum and maximum dates for a staff user ', () => {
    // set datetime in UTC so tests pass both locally and in GitHub
    store.setCurrentJsDate(new Date('2023-06-14T12:00:00.000Z'))
    store.setAuthRoles([AuthorizationRoles.STAFF])

    expect(wrapper.vm.startDateMin).toBe(null) // no minimum date
    expect(wrapper.vm.startDateMax).toBe('2023-09-12') // 90 days from now
  })

  it('has correct minimum and maximum dates for a regular user', () => {
    // set datetime in UTC so tests pass both locally and in GitHub
    store.setCurrentJsDate(new Date('2023-06-14T12:00:00.000Z'))
    store.setAuthRoles([])

    expect(wrapper.vm.startDateMin).toBe('2013-06-14') // 10 years ago
    expect(wrapper.vm.startDateMax).toBe('2023-09-12') // 90 days from now
  })
})
