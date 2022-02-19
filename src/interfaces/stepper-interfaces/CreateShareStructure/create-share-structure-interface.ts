export interface ShareStructureIF {
  valid: boolean
  shareClasses: ShareClassIF[]
}

export interface ShareClassIF {
  id: string
  type?: string // 'Class' or 'Series'
  name: string
  priority: number
  hasMaximumShares?: boolean
  maxNumberOfShares: number
  hasParValue?: boolean
  parValue?: number
  currency?: string
  hasRightsOrRestrictions: boolean
  series?: ShareClassIF[]
}

export const NewShareClass: ShareClassIF = {
  id: null,
  type: 'Class',
  name: '',
  priority: null,
  hasMaximumShares: true,
  maxNumberOfShares: null,
  hasParValue: true,
  parValue: null,
  currency: 'CAD',
  hasRightsOrRestrictions: false,
  series: []
}

export const NewShareSeries: ShareClassIF = {
  id: null,
  type: 'Series',
  name: '',
  priority: null,
  hasMaximumShares: true,
  maxNumberOfShares: null,
  hasParValue: true,
  parValue: null,
  currency: null,
  hasRightsOrRestrictions: false
}
