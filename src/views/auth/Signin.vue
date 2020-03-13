<template>
<sbc-signin
    @sync-user-profile-ready="redirectOnLogin()"
  ></sbc-signin>
</template>

<script lang="ts">
// Libraries
import { Component, Vue } from 'vue-property-decorator'

// Components
import SbcSignin from 'sbc-common-components/src/components/SbcSignin.vue'

@Component({
  components: {
    SbcSignin
  }
})
export default class SigninView extends Vue {
  private async redirectOnLogin () {
    this.$router.push('/define-company')
  }
}

</script>

<style lang="scss">
</style>
