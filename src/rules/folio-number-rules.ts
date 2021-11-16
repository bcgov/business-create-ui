export const FolioNumberRules: Array<Function> = [
  v => (!v || v.trim().length <= 50) || 'Cannot exceed 50 characters' // maximum character count
]
