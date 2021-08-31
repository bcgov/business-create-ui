export interface RulesDocIF {
  // name, lastModified and size are populated via the standard File object
  // https://developer.mozilla.org/en-US/docs/Web/API/File
  name: string
  // A number that represents the number of milliseconds since the Unix epoch
  lastModified: number
  size: number
}
