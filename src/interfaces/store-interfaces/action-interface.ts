// I don't think this file is used any more - CRG Jul23/23
import { ActionContext } from 'vuex'

// Interface to define a Vuex Action
export interface ActionIF {
  (x: ActionContext<string, any>, y: any): void
}
