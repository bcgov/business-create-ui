<template>
  <v-card flat id="step-5-container">
    <div class="certify-container" v-if="certifyStatementResource">
      <div class="certifiedby-container">
        <label>Legal Name</label>
        <div class="value certifiedby">
          <v-text-field
            filled
            persistent-hint
            id="certified-by-textfield"
            label="[Completing Party First Name Middle Name Last Name]"
            hint="Enter the Name of the Completing Party"
            :value="certifiedBy"
            @input="emitCertifiedBy"
          />
        </div>
      </div>

      <v-checkbox
        hide-details
        :value="isCertified"
        @change="emitIsCertified"
      >
        <template slot="label">
          <div class="certify-stmt">
            I, <b>{{trimmedCertifiedBy || '[Legal Name]'}}</b>, {{certifyStatementResource.certifyStatementHeader}}
          </div>
        </template>
      </v-checkbox>
      <ul class="certify-statements mt-4">
        <li v-for="(statement, index) in certifyStatementResource.certifyStatements" :key="`statement-${index}`">
          {{statement}}
          </li>
      </ul>

      <p class="certify-date mt-4">Date: {{date}}</p>
      <p class="certify-clause">{{certifyStatementResource.certifyClause}}</p>

      <p class="emails-line mt-4">
        Copies of the incorporation documents will be sent to the following email addresses:
      </p>
      <ul class="email-addresses">
        <li>
          <span>Registered office email address:</span>&nbsp;
          <a v-if="regOfficeEmail" :href="`mailto:${regOfficeEmail}`">{{regOfficeEmail}}</a>
          <span v-else>(Not entered)</span>
        </li>
        <li>
          <span>Completing party email address:</span>&nbsp;
          <a v-if="completingPartyEmail" :href="`mailto:${completingPartyEmail}`">{{completingPartyEmail}}</a>
          <span v-else>(Not entered)</span>
        </li>
      </ul>
    </div>
  </v-card>
</template>

<script lang="ts">
// Libraries
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'
import { State } from 'vuex-class'

// Interfaces
import { CertifyStatementIF, OrgPersonIF } from '@/interfaces'

// Enums
import { Roles } from '@/enums'

@Component({})
export default class Certify extends Vue {
  // Global state
  @State(state => state.stateModel.defineCompanyStep.businessContact.email)
  readonly regOfficeEmail!: string

  @State(state => state.stateModel.addPeopleAndRoleStep.orgPeople)
  readonly orgPersonList!: OrgPersonIF[]

  // Props passed into this component
  @Prop({ default: '' })
  private date!: string

  @Prop({ default: '' })
  private certifiedBy!: string

  @Prop({ default: () => {} })
  private certifyStatementResource!: CertifyStatementIF

  // Properties
  private isCertified: boolean = false // always false initially

  /** Called when component is created. */
  private created (): void {
    // always give the parent a "valid" event for its property values
    this.emitValid(Boolean(this.trimmedCertifiedBy && this.isCertified))
  }

  /** The Completing Party's email address. */
  private get completingPartyEmail (): string | null {
    const completingParty =
      this.orgPersonList.find(person => {
        return !!person.roles?.some(role => {
          return (role.roleType === Roles.COMPLETING_PARTY)
        })
      })
    return completingParty?.officer?.email || null
  }

  /** The trimmed "Certified By" string (may be ''). */
  private get trimmedCertifiedBy (): string {
    // remove repeated inline whitespace, and leading/trailing whitespace
    return this.certifiedBy && this.certifiedBy.replace(/\s+/g, ' ').trim()
  }

  @Emit('certifiedBy')
  private emitCertifiedBy (certifiedBy: string): string {
    // remove repeated inline whitespace, and leading/trailing whitespace
    certifiedBy = certifiedBy && certifiedBy.replace(/\s+/g, ' ').trim()
    this.emitValid(Boolean(certifiedBy && this.isCertified))
    return certifiedBy
  }

  // Emit an update event when checkbox changes.
  @Emit('isCertified')
  private emitIsCertified (isCertified: boolean): boolean {
    this.isCertified = isCertified
    this.emitValid(Boolean(this.trimmedCertifiedBy && isCertified))
    return isCertified
  }

  // Emit an event indicating whether or not the form is valid.
  @Emit('valid')
  private emitValid (valid: boolean): void { }
}
</script>

<style lang="scss" scoped>
#step-5-container {
  margin-top: 1rem;
  padding-bottom: 0.5rem;
  padding-top: 1rem;
  line-height: 1.2rem;
  font-size: 0.875rem;
}

.certify-container {
  padding: 1.25rem;
}

.certifiedby-container {
  display: flex;
  flex-flow: column nowrap;
  position: relative;

  > label:first-child {
    font-weight: 500;
  }
}

@media (min-width: 768px) {
  .certifiedby-container {
    flex-flow: row nowrap;

    > label:first-child {
      flex: 0 0 auto;
      padding-right: 2rem;
      width: 12rem;
      font-weight: 700;
    }
  }
}

.value.certifiedby {
  min-width: 35rem;
}

.certify-stmt {
  display: inline;
  font-size: 0.875rem;
  color: black;
}

.certify-clause,
.certify-date,
.emails-line {
  padding-left: 2rem;
  color: black;
  font-size: 0.875rem;
}

ul.certify-statements,
ul.email-addresses {
  padding-left: 3rem;
  list-style-type: square;
}
</style>
