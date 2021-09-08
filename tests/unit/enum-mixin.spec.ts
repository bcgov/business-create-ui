import { wrapperFactory } from '../jest-wrapper-factory'
import { EntityInfo } from '@/components/common'

describe('Enum Mixin', () => {
  let vm: any

  beforeEach(() => {
    const wrapper = wrapperFactory(EntityInfo, null, {})
    vm = wrapper.vm
  })

  it('returns correct values for Coop Type to Description helper', () => {
    expect(vm.coopTypeToDescription('CSC')).toBe('Community Service Cooperative')
    expect(vm.coopTypeToDescription('CP')).toBe('Ordinary Cooperative')
    expect(vm.coopTypeToDescription('HC')).toBe('Housing Cooperative')
  })
})
