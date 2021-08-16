<template>
  <sbc-signout :redirect-url="businessesUrl" />
</template>

<script lang="ts">
// Libraries
import { Component, Vue } from 'vue-property-decorator'

// Components
import SbcSignout from 'sbc-common-components/src/components/SbcSignout.vue'

@Component({
  components: {
    SbcSignout
  }
})
export default class SignoutView extends Vue {
  /** The URL of the Business Registry home page. */
  private get businessesUrl (): string {
    return sessionStorage.getItem('BUSINESSES_URL')
  }
}
</script>
