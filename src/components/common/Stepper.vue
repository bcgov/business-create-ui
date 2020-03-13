<template>
  <v-container id="step-buttons-container">
    <template v-for="(step, index) in steps">
      <div class="step" v-bind:key="index">
        <div class="step__indicator">
          <div class="step__line"></div>
          <v-btn class="step__icon" :id=step.id outlined fab color="primary" :to=step.to :disabled=step.disabled>
            <v-icon>{{step.icon}}</v-icon>
          </v-btn>
          <v-icon class="step__icon2" size="30" color="green darken-1" v-show=step.valid>
            mdi-check-circle
          </v-icon>
        </div>
        <div class="step__label pre-line">{{step.text}}</div>
      </div>
    </template>
  </v-container>
</template>

<script lang="ts">
// Libraries
import { Component, Vue } from 'vue-property-decorator'
import { Getter, State } from 'vuex-class'

// Interfaces
import { GetterIF } from '@/interfaces'

// Enums
import { EntityTypes } from '@/enums'

@Component
export default class Stepper extends Vue {
  // Global getters
  @Getter isBusySaving!: GetterIF
  @Getter isTypeBcomp!: GetterIF
  @Getter isTypeCoop!: GetterIF

  // State
  @State(state => state.stateModel.defineCompanyStep.valid)
  readonly step1Valid!: boolean;

  // FUTURE - map these to states as above
  @State(state => state.stateModel.addPeopleAndRoleStep.valid)
  readonly step2Valid!: boolean;
  readonly step3Valid!: boolean;
  readonly step4Valid!: boolean;
  readonly step5Valid!: boolean;

  // Getter to use a particular set of steps
  private get steps (): Array<any> {
    if (this.isTypeBcomp) return this.StepsBC
    else if (this.isTypeCoop) return this.StepsCP
    else return this.StepsElse
  }

  //
  // FUTURE: move following config to a separate file where both
  //         Stepper and Actions can use it.
  //

  // Step configuration for BCOMP
  private get StepsBC (): Array<any> {
    return [{
      id: 'step-1-btn',
      icon: 'mdi-domain',
      text: 'Define Your\nCompany',
      to: '/define-company',
      disabled: this.isBusySaving,
      valid: this.step1Valid
    },
    {
      id: 'step-2-btn',
      icon: 'mdi-account-multiple-plus',
      text: 'Add People\nand Roles',
      to: '/add-people-roles',
      disabled: this.isBusySaving,
      valid: this.step2Valid
    },
    {
      id: 'step-3-btn',
      icon: 'mdi-sitemap',
      text: 'Create Share\nStructure',
      to: '/share-structure',
      disabled: true,
      valid: this.step3Valid
    },
    {
      id: 'step-4-btn',
      icon: 'mdi-handshake',
      text: 'Incorporation\nAgreement',
      to: '/incorp-agreement',
      disabled: true,
      valid: this.step4Valid
    },
    {
      id: 'step-5-btn',
      icon: 'mdi-text-box-check-outline',
      text: 'Review\nand Confirm',
      to: '/review-confirm',
      disabled: this.isBusySaving,
      valid: this.step5Valid
    }]
  }

  // Step configuration for COOP
  private get StepsCP (): Array<any> {
    return [{
      id: 'step-1-btn',
      icon: 'mdi-domain',
      text: 'Define Your\nCompany',
      to: '/define-company',
      disabled: this.isBusySaving,
      valid: this.step1Valid
    },
    {
      id: 'step-2-btn',
      icon: 'mdi-account-multiple-plus',
      text: 'Add People\nand Roles',
      to: '/people-roles',
      disabled: true,
      valid: this.step2Valid
    },
    {
      id: 'step-3-btn',
      icon: 'mdi-format-list-text',
      text: 'Create\nRules',
      to: '/rules',
      disabled: true,
      valid: this.step3Valid
    },
    {
      id: 'step-4-btn',
      icon: 'mdi-file-document-box-multiple',
      text: 'Create\nMemorandum',
      to: '/memorandum',
      disabled: true,
      valid: this.step4Valid
    },
    {
      id: 'step-5-btn',
      icon: 'mdi-file-document-box-check-outline',
      text: 'Review\nand Confirm',
      to: '/review-confirm',
      disabled: this.isBusySaving,
      valid: this.step5Valid
    }]
  }

  // Step configuration for fallback
  private get StepsElse (): Array<any> {
    return [{
      id: 'step-1-btn',
      icon: 'mdi-domain',
      text: 'Define Your\nCompany',
      to: '/define-company',
      disabled: false
    },
    {
      id: 'step-2-btn',
      icon: 'mdi-dots-horizontal',
      disabled: true
    },
    {
      id: 'step-3-btn',
      icon: 'mdi-dots-horizontal',
      disabled: true
    },
    {
      id: 'step-4-btn',
      icon: 'mdi-dots-horizontal',
      disabled: true
    },
    {
      id: 'step-5-btn',
      icon: 'mdi-dots-horizontal',
      disabled: true
    }]
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#step-buttons-container {
  display: flex;
  justify-content: space-evenly;
  margin: 0;
  padding: 2rem 0;
  background: $BCgovInputBG;
}

.step {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  align-items: center;
  justify-content: center;
}

.step__indicator {
  position: relative;
  width: 100%;
  text-align: center;
}

.step__line {
  position: absolute;
  top: 50%;
  left: 0;
  height: 2px;
  width: 100%;
  background-color: $gray5;
  transform: translateX(-50%);
}

.step:first-child .step__line {
  display: none;
}

.step__icon {
  position: relative;
  background-color: $BCgovInputBG;
  z-index: 2;
}

.step__icon2 {
  position: relative;
  margin-top: -32px;
  margin-left: -16px;
  background: $BCgovInputBG;
  border-radius: 50%;
  z-index: 3;
}

.step__label {
  margin-top: 10px;
  text-align: center;
}
</style>
