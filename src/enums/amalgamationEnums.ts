export enum AmlStatuses {
  OK,
  ERROR_CCC_MISMATCH,
  ERROR_FOREIGN,
  ERROR_FOREIGN_UNLIMITED,
  ERROR_FUTURE_EFFECTIVE_FILING,
  ERROR_LIMITED_RESTORATION,
  ERROR_NOT_AFFILIATED,
  ERROR_NOT_IN_GOOD_STANDING,
  ERROR_ULC_MISMATCH,
}

export enum AmlRoles {
  AMALGAMATING = 'amalgamating',
  HOLDING = 'holding'
}

export enum AmlTypes {
  LEAR = 'lear',
  FOREIGN = 'foreign'
}
