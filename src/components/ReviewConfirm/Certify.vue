<template>
  <v-card flat id="step-5-container">
    <div class="certify-container">
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
        :value="isCertified"
        @change="emitIsCertified"
      >
        <template slot="label">
          <div class="certify-stmt">
            I, <b>{{trimmedCertifiedBy || '[Legal Name]'}}</b>, {{certifyStatementResource.certifyStatementHeader}}
          </div>
        </template>
      </v-checkbox>
      <p>
        <ul class="certify-statements">
          <li v-for="(statement, index) in certifyStatementResource.certifyStatements" v-bind:key="index">
              {{ statement }}
          </li>
        </ul>
      </p>
      <p></p>
      <p class="certify-date">Date: {{date}}</p>
      <p class="certify-clause">
        {{certifyStatementResource.certifyClause}}
      </p>
    </div>
  </v-card>
</template>

<script lang="ts">
// Libraries
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'

// Interfaces
import { CertifyStatementIF } from '@/interfaces'

@Component({})
export default class Certify extends Vue {
  // Props passed into this component.
  @Prop({ default: '' })
  private date!: string

  @Prop({ default: '' })
  private certifiedBy!: string

  @Prop({ default: () => {} })
  private certifyStatementResource!: CertifyStatementIF

  // Properties
  private isCertified: boolean = false

  /**
   * Lifecycle callback to always give the parent a "valid" event for its property values.
   */
  private created (): void {
    this.emitValid(Boolean(this.trimmedCertifiedBy && this.isCertified))
  }

  /**
   * Computed value.
   * @returns The trimmed "Certified By" string (may be '').
   */
  private get trimmedCertifiedBy (): string {
    // remove repeated inline whitespace, and leading/trailing whitespace
    return this.certifiedBy && this.certifiedBy.replace(/\s+/g, ' ').trim()
  }

   @Emit('certifiedByChange')
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

.certify-clause, .certify-date{
  padding-left: 2rem;
  color: black;
  font-size: 0.875rem;
}

.certify-stmt {
  display:inline;
  font-size: 0.875rem;
  color: black;
}

ul.certify-statements {
  padding-left:3rem;
  padding-top: 0.5rem;
  list-style-type: square;
}
</style>
