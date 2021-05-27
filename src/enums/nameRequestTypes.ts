import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'

/** Enum to show that NR types are a subset of corp types. */
/** Enum to map NR types to corp types. */
/** Enum to sync NR types with corp types. */
export enum NameRequestTypes {
  BC = CorpTypeCd.BC_COMPANY,
  CR = CorpTypeCd.BC_CORPORATION, // SPECIAL NAMEREQUEST-ONLY ENTITY TYPE
  UL = CorpTypeCd.BC_UNLIMITED, // SPECIAL NAMEREQUEST-ONLY ENTITY TYPE
  CC = CorpTypeCd.BC_CCC
}
