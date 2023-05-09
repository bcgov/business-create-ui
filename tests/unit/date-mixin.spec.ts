import Vue from 'vue'
import Vuetify from 'vuetify'
import { shallowMount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import MixinTester from '@/mixin-tester.vue'

Vue.use(Vuetify)

const vuetify = new Vuetify({})
setActivePinia(createPinia())
const store = useStore() as any // remove typings for unit tests

describe('Date Mixin', () => {
  let vm: any

  beforeAll(async () => {
    // mount the component and wait for everything to stabilize
    // (this can be any component since we are not really using it)
    const wrapper = shallowMount(MixinTester, { vuetify })
    vm = wrapper.vm
    await Vue.nextTick()
  })

  it('returns correct values for dateToYyyyMmDd()', () => {
    expect(vm.dateToYyyyMmDd(null)).toBeNull()
    expect(vm.dateToYyyyMmDd(new Date('not a date'))).toBeNull()
    // verify that GMT/UTC is correctly converted to Pacific
    expect(vm.dateToYyyyMmDd(new Date('2021-01-01 07:00:00 GMT'))).toBe('2020-12-31') // Standard Time
    expect(vm.dateToYyyyMmDd(new Date('2021-01-01 08:00:00 GMT'))).toBe('2021-01-01') // Standard Time
    expect(vm.dateToYyyyMmDd(new Date('2021-07-01 06:00:00 GMT'))).toBe('2021-06-30') // Daylight Time
    expect(vm.dateToYyyyMmDd(new Date('2021-07-01 07:00:00 GMT'))).toBe('2021-07-01') // Daylight Time
    // verify that Pacific is correctly converted to Pacific
    expect(vm.dateToYyyyMmDd(new Date('2021-01-01 00:00:00 PST'))).toBe('2021-01-01')
    expect(vm.dateToYyyyMmDd(new Date('2021-01-01 23:59:59 PST'))).toBe('2021-01-01')
    expect(vm.dateToYyyyMmDd(new Date('2021-07-01 00:00:00 PDT'))).toBe('2021-07-01')
    expect(vm.dateToYyyyMmDd(new Date('2021-07-01 23:59:59 PDT'))).toBe('2021-07-01')
    // verify that Eastern is correctly converted to Pacific
    expect(vm.dateToYyyyMmDd(new Date('2021-01-01 02:00:00 EST'))).toBe('2020-12-31')
    expect(vm.dateToYyyyMmDd(new Date('2021-01-01 03:00:00 EST'))).toBe('2021-01-01')
    expect(vm.dateToYyyyMmDd(new Date('2021-07-01 02:00:00 EDT'))).toBe('2021-06-30')
    expect(vm.dateToYyyyMmDd(new Date('2021-07-01 03:00:00 EDT'))).toBe('2021-07-01')
  })

  it('returns correct values for yyyyMmDdToDate()', () => {
    // init store
    store.stateModel.currentJsDate = new Date('2021-11-23T12:00:00')

    expect(vm.yyyyMmDdToDate(null)).toBeNull()
    expect(vm.yyyyMmDdToDate('12345678901')).toBeNull()
    expect(vm.yyyyMmDdToDate('2021-01-01').toISOString()).toEqual('2021-01-01T08:00:00.000Z') // PST
    expect(vm.yyyyMmDdToDate('2021-07-01').toISOString()).toEqual('2021-07-01T07:00:00.000Z') // PDT
  })
})
