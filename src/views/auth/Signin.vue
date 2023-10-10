<template>
  <div />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator'
import { Navigate } from '@/utils'

@Component({})
export default class Signin extends Vue {
  /** Called when component is created. */
  created (): void {
    // navigate to BC Registry login page then return to this app
    const loginUrl = sessionStorage.getItem('REGISTRY_HOME_URL') + 'login'
    const baseUrl = sessionStorage.getItem('BASE_URL').replace(/\/$/, '') // remove trailing /
    const redirect = this.$route.query.redirect
    const returnUrl = encodeURIComponent(baseUrl + redirect)
    Navigate(`${loginUrl}?return=${returnUrl}`)
  }
}
</script>
