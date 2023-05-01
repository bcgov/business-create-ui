// "ambient module" - used to describe modules written in JS
// (needed for unit test files to find component modules)
declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}
