import { Location } from '@/enums'
import { JurisdictionI } from '@/interfaces'

export const CanJurisdictions: JurisdictionI[] = [
  {
    value: 'AB',
    SHORT_DESC: 'AB',
    text: 'Alberta'
  },
  {
    value: Location.BC,
    SHORT_DESC: 'BC',
    text: 'British Columbia'
  },
  {
    value: 'MB',
    SHORT_DESC: 'MB',
    text: 'Manitoba'
  },
  {
    value: 'NB',
    SHORT_DESC: 'NB',
    text: 'New Brunswick'
  },
  {
    value: 'NF',
    SHORT_DESC: 'NF',
    text: 'Newfoundland And Labrador'
  },
  {
    value: 'NT',
    SHORT_DESC: 'NT',
    text: 'Northwest Territories'
  },
  {
    value: 'NS',
    SHORT_DESC: 'NS',
    text: 'Nova Scotia'
  },
  {
    value: 'NU',
    SHORT_DESC: 'NU',
    text: 'Nunavut'
  },
  {
    value: 'ON',
    SHORT_DESC: 'ON',
    text: 'Ontario'
  },
  {
    value: 'PE',
    SHORT_DESC: 'PE',
    text: 'Prince Edward Island'
  },
  {
    value: 'QC',
    SHORT_DESC: 'QC',
    text: 'Quebec'
  },
  {
    value: 'SK',
    SHORT_DESC: 'SK',
    text: 'Saskatchewan'
  },
  {
    value: 'YT',
    SHORT_DESC: 'YT',
    text: 'Yukon'
  },
  {
    value: Location.FD,
    SHORT_DESC: 'FED',
    text: 'Federal'
  }
]

export const MrasJurisdictions = [
  'alberta',
  'manitoba',
  'nova scotia',
  'ontario',
  'quebec',
  'saskatchewan'
]
