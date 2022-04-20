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
        <p class="mb-0 checkbox-gp-text">{{ label }}</p>
        <div id="business-check-div">
          <v-checkbox
            class="mt-0"
            v-model="checked"
            hide-details
            :label="text"
          >
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
  /** The registration business number. */
  @Prop({ required: true })
  readonly businessTypeConfirm!: boolean

  /** Whether to display Change features. */
  @Prop({ default: false })
  readonly hasBusinessTypeChecked!: boolean;

  /** Whether the business typ is SP or GP */
  @Prop({ default: false })
  readonly isTypePartnership!: boolean;

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
    this.emitBusinessType()
    this.emitValid()
  }

  /** Emits updated business type event. */
  @Emit('update:businessTypeConfirm')
  private emitBusinessType (): boolean {
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

#business-check-div {
  display: flex;
  margin-top: 20px;
}

#business-check-div .mt-0 {
  margin-left: -3px;
  padding-top: 1px;
}

::v-deep .v-input--checkbox .v-input__slot {
  align-items: flex-start;
}

.invalid-section ::v-deep .v-input--checkbox .v-input__slot .v-label {
  color: $app-red !important;
}

.v-icon.mdi-open-in-new {
  margin-top: -2px;
  padding-left: 2px;
}
</style>
