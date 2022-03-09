export interface NaicsElementIF {
  classTitle: string
  code: string
  elementDescription: string
  elementType: string // ALL_EXAMPLES or ILLUSTRATIVE_EXAMPLES
  version: number
  year: number
}

export interface NaicsResultIF {
  classDefinition: string
  classTitle: string
  code: string
  naicsElements: Array<NaicsElementIF>
  naicsKey: string
  version: number
  year: number
}
