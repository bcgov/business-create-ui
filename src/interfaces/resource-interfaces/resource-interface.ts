import { CertifyStatementIF } from './component-resource-interfaces/certifyStatement-interface'
import { ExternalResourceIF } from './ExternalResourceIF'

// Interface to define the resource model example
export interface ResourceIF {
  certifyStatementResource: CertifyStatementIF;
  externalResource: ExternalResourceIF;
}
