<template>
  <div id="business-type">
    <v-row no-gutters>
      <v-col cols="12" sm="3" class="pr-4">
        <label class="d-block title-label">Business Type</label>
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
        <p class="mb-0">General Partnership</p>
        <div id="business-type-div">
          <v-checkbox
            class="business-type-check mt-0"
            hide-details
            v-model="checked"
          />
          <p class="mb-0" id="business-type-text">
            I acknowledge that a General Partnership cannot be changed into a
            Sole Proprietorship (including DBA). If this is necessary, a new
            Name Request Number and Statement of Registration (along with
            associated fees) will be required.
          </p>
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

  // Local variables
  protected checked = false;

  /** Called when component is mounted. */
  protected mounted (): void {
    // init model variable + validate
    this.checked = this.businessTypeConfirm
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

#business-type {
  .col-sm-3 {
    color: $gray9;
    font-weight: bold;
  }

  .col-sm-9 {
    color: $gray7;
  }
}

#business-type-div {
  display: flex;
  margin-top: 20px;
}

#business-type-div .business-type-check {
  margin-left: -3px;
  padding-top: 1px;
}

#business-type-text {
  font-size: 15px;
}

.v-icon.mdi-open-in-new {
  margin-top: -2px;
  padding-left: 2px;
}
</style>
