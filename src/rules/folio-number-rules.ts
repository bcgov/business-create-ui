export const FolioNumberRules: Array<Function> = [
  v => (!v || v.length <= 50) || 'Cannot exceed 50 characters' // maximum character count
]
