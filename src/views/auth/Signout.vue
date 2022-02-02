<template>
  <SbcSignout :redirect-url="redirectUrl" />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { SbcSignout } from '@/components'

@Component({
  components: {
    SbcSignout
  }
})
export default class SignoutView extends Vue {
  get redirectUrl (): string {
    // after signout, redirect to BC Registries login page
    return sessionStorage.getItem('REGISTRY_HOME_URL') + 'login'
  }
}
</script>
