import { HelpSectionIF } from '@/interfaces'

export interface CustodianResourceIF {
  sectionSubtitle: string
  helpSection: HelpSectionIF
  custodianTitle: string
  baseAddressValues: {
    country: string
    region: string
  }
}
