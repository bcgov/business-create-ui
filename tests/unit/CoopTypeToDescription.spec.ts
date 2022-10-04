import { CoopTypeToDescription } from '@/utils'

describe('Enum Mixin', () => {
  it('returns correct values for Coop Type to Description helper', () => {
    expect(CoopTypeToDescription('CSC' as any)).toBe('Community Service Cooperative')
    expect(CoopTypeToDescription('CP' as any)).toBe('Ordinary Cooperative')
    expect(CoopTypeToDescription('HC' as any)).toBe('Housing Cooperative')
    expect(CoopTypeToDescription('other' as any)).toBe('other')
  })
})
