<template>
  <v-dialog
    v-model="dialog"
    width="45rem"
    persistent
    :attach="attach"
    content-class="name-request-error-dialog"
  >
    <v-card>
      <v-card-title id="dialog-title">
        Name Request Error
      </v-card-title>

      <v-card-text id="dialog-text">
        <div class="font-14 mb-4">
          <p>{{ error }}</p>
        </div>
      </v-card-text>

      <v-divider class="my-0" />

      <v-card-actions>
        <v-spacer />
        <v-btn
          id="dialog-okay-button"
          color="primary"
          text
          @click="okay()"
        >
          OK
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'

@Component({})
export default class NameRequestErrorDialog extends Vue {
  /** Prop to display the dialog. */
  @Prop({ default: false }) readonly dialog!: boolean

  /** Prop to provide attachment selector. */
  @Prop({ default: '' }) readonly attach!: string

  /** Prop to provide error message. */
  @Prop({ default: '' }) readonly error!: string

  @Emit() okay (): void {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#dialog-text {
  color: $gray9;
}
</style>
