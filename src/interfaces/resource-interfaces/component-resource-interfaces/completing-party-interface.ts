export interface CompletingPartyStatementIF {
  certifyStatements: Array<string>
  certifyClause: string
  entityDisplay?: string
}

export const EmptyCompletingPartyStatement: CompletingPartyStatementIF = {
  certifyStatements: [],
  certifyClause: null,
  entityDisplay: null
}
