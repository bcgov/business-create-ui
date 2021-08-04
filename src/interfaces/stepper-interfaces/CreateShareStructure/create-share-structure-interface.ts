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
