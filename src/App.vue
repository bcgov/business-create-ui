<template>
  <v-app id="app">
    <div class="app-body">
      <SbcHeader />
      <EntityInfo />
      <main>
        <router-view />
      </main>
      <SbcFooter />
    </div>
  </v-app>
</template>

<script lang="ts">
// Libraries
import { Component, Vue } from 'vue-property-decorator'

// Components
import SbcHeader from 'sbc-common-components/src/components/SbcHeader.vue'
import SbcFooter from 'sbc-common-components/src/components/SbcFooter.vue'
import { EntityInfo } from '@/components/common'

@Component({
  components: {
    SbcHeader,
    SbcFooter,
    EntityInfo
  }
})
export default class App extends Vue {
}
</script>

<style lang="scss">
</style>
