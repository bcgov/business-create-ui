import { CertifyStatementIF, ExternalResourceIF } from '@/interfaces'

// Interface to define the resource model example
export interface ResourceIF {
  certifyStatementResource: CertifyStatementIF | null;
  externalResource: ExternalResourceIF | null;
}
