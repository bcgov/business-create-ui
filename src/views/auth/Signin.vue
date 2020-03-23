<template>
<sbc-signin
    @keycloak-session-ready="redirectOnLogin()"
  ></sbc-signin>
</template>

<script lang="ts">
// Libraries
import { Component, Vue } from 'vue-property-decorator'
import { Action } from 'vuex-class'

// Components
import SbcSignin from 'sbc-common-components/src/components/SbcSignin.vue'

// Interfaces
import { ActionBindingIF } from '@/interfaces'

@Component({
  components: {
    SbcSignin
  }
})
export default class SigninView extends Vue {
  @Action setAuthenticated: ActionBindingIF

  // Called when keycloak-session-ready event is emitted which indicates the user is authenticated
  private async redirectOnLogin () {
    this.setAuthenticated(true)
    this.$router.push(
      { path: '/define-company',
        query: this.getQueryParamMap(this.$route.query.redirect as string)
      })
  }

  /**
   * Helper function to pull out query parameters fed in through the sign in redirect
   * otherwise the params are lost when pushed into the router
   */
  private getQueryParamMap (url: string) {
    let paramConfig = {}
    if (url) {
      // Decode the redirect uri
      let redirectPath : string = decodeURIComponent(url)
      let redirectSplit: string[] = redirectPath.split('/?redirect=')

      // redirect param comes in differently when accessed via the root route,
      // if split unsuccessful
      // check for root path expected format e.g /?nrNumber=12345
      if (redirectSplit && redirectSplit.length === 1) {
        redirectSplit = redirectPath.split('/')
      }
      if (redirectSplit && redirectSplit.length >= 2 && redirectSplit[1].indexOf('?') >= 0) {
        // Split into query param strings
        let queryParams: string[] = redirectSplit[1].split('?')
        if (queryParams) {
          // Split into key/value
          queryParams.forEach(param => {
            if (param.indexOf('=') >= 0) {
              let paramSplit : string[] = param.split('=')
              paramConfig[paramSplit[0]] = paramSplit[1]
            }
          })
        }
      }
    }
    return paramConfig
  }
}

</script>

<style lang="scss">
</style>
