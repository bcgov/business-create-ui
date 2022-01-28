import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'

/** Enum to sync NR types with corp types. */
export enum NameRequestTypes {
  BC = CorpTypeCd.BC_COMPANY,
  CR = CorpTypeCd.BC_CORPORATION, // SPECIAL NAMEREQUEST-ONLY ENTITY TYPE
  UL = CorpTypeCd.BC_UNLIMITED, // SPECIAL NAMEREQUEST-ONLY ENTITY TYPE
  CC = CorpTypeCd.BC_CCC,
  CP = CorpTypeCd.COOP,
  FR = CorpTypeCd.NR_SOLE_PROP,
  GP = CorpTypeCd.PARTNERSHIP
}
