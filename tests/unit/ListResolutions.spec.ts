import Vuetify from 'vuetify'
import { createPinia, setActivePinia } from 'pinia'
import ListResolutions from '@/components/common/ListResolutions.vue'
import { useStore } from '@/store/store'
import { mount } from '@vue/test-utils'

const vuetify = new Vuetify({})
setActivePinia(createPinia())
const store = useStore()

describe('List Resolutions component', () => {
  let wrapper: any

  const resolutionList = [
    {
      'date': '2024-07-15',
      'id': 123456,
      'type': 'SPECIAL'
    },
    {
      'date': '2024-07-17',
      'id': 123457,
      'type': 'SPECIAL'
    },
    {
      'date': '2024-07-18',
      'id': 123458,
      'type': 'SPECIAL'
    },
    {
      'date': '2024-08-15',
      'id': 123459,
      'type': 'SPECIAL'
    }
  ]

  it('ddoes not display resolutions if list is empty', () => {
    store.stateModel.resolutions = []
    wrapper = mount(ListResolutions, { vuetify })

    expect(wrapper.find('#resolution-list').exists()).toBe(false)
    expect(wrapper.find('#resolution-label').exists()).toBeFalsy()

    wrapper.destroy()
  })

  it('displays the correct number and dates of resolutions', () => {
    store.stateModel.resolutions = resolutionList
    wrapper = mount(ListResolutions, { vuetify })

    const list = wrapper.find('#resolution-list')
    const td = list.findAll('tr > td')

    expect(wrapper.find('#resolution-label').exists()).toBeTruthy()
    expect(td.length).toBe(4)
    expect(td.at(0).text()).toBe('2024-07-15')
    expect(td.at(3).text()).toBe('2024-08-15')

    wrapper.destroy()
  })
})
