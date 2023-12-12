<template>
  <section class="foreign-business">
    <v-form
      ref="foreignBusinessForm"
      @submit.prevent
    >
      <v-row no-gutters>
        <v-col
          cols="12"
          sm="3"
        >
          <label>Add a Foreign Business</label>
        </v-col>
        <v-col
          cols="12"
          sm="9"
        >
          <NestedSelect
            label="Select the home jurisdiction"
            :errorMessages="jurisdictionErrorMessage"
            :menuItems="jurisdictionOptions"
            :value="jurisdiction ? jurisdiction.text : ''"
            @change="onJurisdictionChange($event)"
          />
        </v-col>
        <v-col
          cols="12"
          sm="9"
          offset="3"
        >
          <v-text-field
            v-model="legalName"
            filled
            label="Business' full legal name in home jurisdiction"
            :rules="rules"
          />
        </v-col>
        <v-col
          cols="12"
          sm="9"
          offset="3"
        >
          <v-text-field
            v-model="corpNumber"
            filled
            label="Corporate number in home jurisdiction"
            :rules="rules"
          />
        </v-col>
        <v-col
          cols="auto"
          class="ms-auto"
        >
          <v-btn
            large
            color="primary"
            class="mr-3"
            @click="addForeignBusiness()"
          >
            Add
          </v-btn>
          <v-btn
            large
            outlined
            color="primary"
            @click="emitCancel()"
          >
            Cancel
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </section>
</template>

<script lang="ts">
import { Component, Emit, Vue } from 'vue-property-decorator'
import NestedSelect from '@/components/common/NestedSelect.vue'
import { AmalgamatingBusinessIF } from '@/interfaces'
import { AmlRoles, Location } from '@/enums'
import { CanJurisdictions, IntlJurisdictions } from '@/list-data'

@Component({
  components: { NestedSelect }
})
export default class ForeignBusiness extends Vue {
  // Refs
  $refs!: {
    foreignBusinessForm: any
  }

  // Local properties
  jurisdiction = null
  legalName = null
  corpNumber = null
  isCan = false

  // Validation properties
  jurisdictionErrorMessage = ''

  get isValid (): boolean {
    return (this.jurisdiction && this.legalName && this.corpNumber)
  }

  get rules (): Array<(v) => boolean | string> {
    return [ v => !!v || 'Required.' ]
  }

  /** The jursidiction select options */
  get jurisdictionOptions (): Array<any> {
    const array = [] as Array<any>

    // add in Canadian jurisdictions (not including BC)
    array.push({ isHeader: true, group: 0, text: 'Canadian' })
    CanJurisdictions
      .filter(jur => jur.value !== Location.BC)
      .forEach(jur => array.push({
        group: 0,
        text: jur.text,
        value: jur.value,
        separator: (jur.value === Location.FD)
      }))

    // add in International jurisdictions (not including CA)
    array.push({ isHeader: true, group: 1, text: 'International' })
    IntlJurisdictions
      .filter(jur => jur.value !== Location.CA)
      .forEach(jur => array.push({
        group: 1,
        text: jur.text,
        value: jur.value,
        separator: false
      }))

    return array
  }

  /** Called when Jurisdiction menu item is changed. */
  onJurisdictionChange (jurisdiction: any): void {
    this.jurisdiction = jurisdiction
    this.isCan = jurisdiction.group === 0
    this.jurisdictionErrorMessage = this.jurisdiction ? '' : 'Required.'
  }

  /** Add the amalgamating foreign business. */
  addForeignBusiness (): void {
    // Validate
    this.validate()
    if (!this.isValid) return

    // Create the amalgamating foreign business object
    const business = {
      type: 'foreign',
      role: AmlRoles.AMALGAMATING,
      foreignJurisdiction: {
        region: this.isCan ? this.jurisdiction.text : '',
        country: this.isCan ? Location.CA : this.jurisdiction.value
      },
      legalName: this.legalName,
      corpNumber: this.corpNumber
    } as AmalgamatingBusinessIF

    // Emit the amalgamating foreign business.
    this.emitForeignBusiness(business)
  }

  /** Validate the inputs. */
  validate (): void {
    this.jurisdictionErrorMessage = this.jurisdiction ? '' : 'Required.'
    this.$refs.foreignBusinessForm.validate()
  }

  @Emit('add:foreignBusiness')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private emitForeignBusiness (foreignBusiness: AmalgamatingBusinessIF): void {}

  @Emit('cancel')
  emitCancel (): boolean {
    return true
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

// un-bold v-text-field labels
:deep(.v-label) {
  font-weight: normal;
  color: $gray7;
}

</style>
