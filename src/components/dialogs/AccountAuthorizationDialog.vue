<template>
  <v-dialog v-model="dialog" width="45rem" persistent :attach="attach" content-class="account-authorization-dialog">
    <v-card>
      <v-card-title>Account Authorization</v-card-title>

      <v-card-text>
        <p class="genErr">This account appears to be unable to access this name request. You can
          retry to access this name request now, or you can exit and return to the dashboard.</p>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn id="dialog-exit-button" color="primary" text @click="exit()">Exit</v-btn>
        <v-spacer></v-spacer>
        <v-btn id="dialog-retry-button" color="primary" text @click="retry()">Retry</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'
@Component({
  computed: {},
  components: { }
})
export default class AccountAuthorizationDialog extends Vue {
  // Prop to display the dialog.
  @Prop() private dialog: boolean

  // Prop to provide attachment selector.
  @Prop() private attach: string

  // Pass click events to parent.
  @Emit() private exit () { }
  @Emit() private retry () { }
}
</script>

<style lang="scss" scoped>
// @import '@/assets/styles/theme.scss';
</style>
