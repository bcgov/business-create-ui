import { IncorporationAgreementTypeIF } from '@/interfaces'

export const AgreementTypeResource: IncorporationAgreementTypeIF[] = [
  {
    code: 'sample',
    description: 'The <b>sample Incorporation Agreement and Benefit Company Articles</b> containing a benefit ' +
               'provision have been completed and a copy added to the company\'s record book.',
    summaryDescription: 'The sample Incorporation Agreement and Benefit Company Articles containing a benefit ' +
               'provision have been completed and a copy added to the company\'s record book.'
  },
  {
    code: 'custom',
    description: 'A <b>custom Incorporation Agreement and custom Benefit Company Articles</b> containing ' +
             'a benefit provision have been completed and a copy added to the company\'s record book.',
    summaryDescription: 'A custom Incorporation Agreement and custom Benefit Company Articles containing ' +
             'a benefit provision have been completed and a copy added to the company\'s record book.'
  }
]
