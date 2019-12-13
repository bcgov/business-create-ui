import Home from '@/views/Home.vue'
import MixinExample from '@/views/MixinExample.vue'
import StateExample from '@/views/StateExample.vue'

export const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/MixinExample',
    name: 'mixinExample',
    component: MixinExample
  },
  {
    path: '/StateExample',
    name: 'stateExample',
    component: StateExample
  },
  {
    // default/fallback route
    path: '*',
    redirect: '/'
  }]
