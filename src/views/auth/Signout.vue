<template>
  <sbc-signout :redirect-url="redirectUrl"></sbc-signout>
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
  private redirectUrl = sessionStorage.getItem('AUTH_URL');
}

</script>

<style lang="scss">
</style>
