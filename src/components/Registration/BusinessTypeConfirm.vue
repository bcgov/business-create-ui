<template>
  <div id="business-type-confirm">
      <v-row no-gutters>
        <v-col cols="12" sm="3" class="pr-4">
          <label class="d-block">Business Type</label>
          <v-chip
            v-if="hasBusinessTypeChecked"
            id="checked-chip"
            x-small label
            color="primary"
            text-color="white"
          >
            Checked
          </v-chip>
        </v-col>

        <v-col cols="12" sm="9">
          <p class="mb-0">{{ label }}</p>
          <div id="business-checkbox-div">
            <v-checkbox
              hide-details
              v-model="checked"
              class="mt-0 pt-0"
            >
              <template slot="label">
                <div class="certify-stmt" :class="{'error--text': showErrors}">{{ text }}</div>
              </template>
            </v-checkbox>
          </div>
        </v-col>
      </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator'

@Component
export default class BusinessTypeConfirm extends Vue {
  /** Initial business type confirm flag. */
  @Prop({ required: true }) readonly businessTypeConfirm!: boolean

  /** Whether to display Change features. */
  @Prop({ default: false }) readonly hasBusinessTypeChecked!: boolean;

  /** Whether the business type is SP or GP. */
  @Prop({ default: false }) readonly isTypePartnership!: boolean;

  /** Whether to show errors. */
  @Prop({ required: true }) readonly showErrors!: boolean

  // Local variables
  protected checked = false
  protected label = 'General Partnership'
  protected labelSP = 'BC Sole Proprietorship / Doing Business As (DBA) Registration'
  protected text = `I acknowledge that a General Partnership cannot be \
    changed into a Sole Proprietorship (including DBA). If this is \
    necessary, a new Name Request Number and Statement of Registration \
    (along with associated fees) will be required.`
  protected textSP = `I acknowledge that a Sole Proprietorship (including DBA) \
    cannot be changed into a General Partnership. If this is necessary, a new \
    Name Request Number and Statement of Registration (along with associated fees) \
    will be required.`

  /** Called when component is mounted. */
  protected mounted (): void {
    // init model variable + validate
    this.checked = this.businessTypeConfirm
    this.label = this.isTypePartnership ? this.label : this.labelSP
    this.text = this.isTypePartnership ? this.text : this.textSP
    this.emitValid()
  }

  /** Watches for changes to the checkbox value. */
  @Watch('checked')
  private onValueChanged (): void {
    // update business type + validate
    this.emitBusinessTypeConfirm()
    this.emitValid()
  }

  /** Emits updated business type event. */
  @Emit('update:businessTypeConfirm')
  private emitBusinessTypeConfirm (): boolean {
    return this.checked
  }

  // /** Emits component validity event. */
  @Emit('valid')
  private emitValid (): boolean {
    return this.checked
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/theme.scss";

#business-type-confirm {
  .col-sm-3 {
    color: $gray9;
    font-weight: bold;
  }

  .col-sm-9 {
    color: $gray7;
  }
}

#business-checkbox-div {
  margin-top: 20px;
}

.certify-stmt {
  display: inline;
  font-size: 0.875rem;
  color: $gray7;
  font-weight: normal;
}

// Align the checkbox slot to the top left
::v-deep .v-input--checkbox .v-input__slot {
  align-items: flex-start;
}

// Align the checkbox icon with the left of the text (GP or SP)
::v-deep .v-input--checkbox .v-input__slot .v-input--selection-controls__input {
  margin-left: -3px;
}

.invalid-section .certify-stmt {
  color: $app-red !important;
}

.v-icon.mdi-open-in-new {
  margin-top: -2px;
  padding-left: 2px;
}
</style>
