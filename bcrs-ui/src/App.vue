<template>
  <v-app id="app">

    <sbc-header ref="sbcHeader" :brandLink="origin" :authURL="authAPIURL" />

    <div class="app-body">
      <main>
        <router-view />
      </main>
    </div>

    <sbc-footer />

  </v-app>
</template>

<script lang="ts">
// Libraries
import { Component, Vue } from 'vue-property-decorator'

// Components
import SbcHeader from 'sbc-common-components/src/components/SbcHeader.vue'
import SbcFooter from 'sbc-common-components/src/components/SbcFooter.vue'

@Component({
  components: {
    SbcHeader,
    SbcFooter
  }
})
export default class App extends Vue {}
</script>

<style lang="scss">
</style>
