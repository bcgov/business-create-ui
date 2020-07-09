<template>
  <div id="name-translation">
    <!-- Name Translation form -->
    <v-form v-model="nameTranslationForm" ref="ntForm" name="business-contact-form">
      <v-row>
        <v-col class="pb-0">
          <v-text-field
            filled
            persistent-hint
            label="Enter Name Translation"
            v-model="nameTranslation"
            :rules="nameTranslationRules"
            >
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="form__btns pt-0">
          <v-btn large color="error" id='btn-remove' disabled>Remove</v-btn>
          <v-btn large class="form-primary-btn" color="primary" id='btn-done' :disabled="!nameTranslationForm"
               @click="addTranslation()">Done</v-btn>
          <v-btn large class="form-cancel-btn" id='btn-cancel' @click="cancelTranslation">Cancel</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({})
export default class NameTranslation extends Vue {
  @Prop({ default: '' })
  private editNameTranslation: string

  // Local Properties
  private nameTranslationForm: boolean = false
  private nameTranslation: string = ''

  // Validation Rules
  private readonly nameTranslationRules: Array<Function> = [
    v => !!v || 'A name is required', // is not empty
    v => /^[a-z|0-9A-Z]+(?: [a-z|0-9A-Z]+)*$/.test(v) || 'Invalid character', // numbers, letters and single spaces only
    v => (!v || v.length <= 50) || 'Cannot exceed 50 characters' // maximum character count
  ]
  mounted () {
    if (this.editNameTranslation) this.nameTranslation = this.editNameTranslation
  }

  // Events
  @Emit('addTranslation')
  private addTranslation (index = null): string {
    return this.nameTranslation
  }

  @Emit('cancelTranslation')
  private cancelTranslation (): void {}
}
</script>

<style lang="scss" scoped>
</style>
