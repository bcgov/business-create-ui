// Libraries
import { createPinia } from 'pinia'

/**
 * Configures and returns Pinia Store.
 */
export function getPiniaStore () {
  // Vue.use(PiniaVuePlugin)

  return createPinia()
}
