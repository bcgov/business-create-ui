import { Wrapper } from '@vue/test-utils'

/**
 * Returns the last event for a given name, to be used for testing event propagation
 * in response to component changes.
 *
 * @param wrapper the wrapper for the component that is being tested.
 * @param name the name of the event that is to be returned.
 *
 * @returns the value of the last named event for the wrapper.
 */
export function getLastEvent (wrapper: Wrapper<any>, name: string): any {
  const eventsList = wrapper.emitted(name)
  const events = eventsList && eventsList[eventsList.length - 1]
  return events && events[0]
}
