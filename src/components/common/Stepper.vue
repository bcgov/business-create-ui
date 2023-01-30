<template>
  <v-card id="step-buttons-container">
    <template v-for="(step, index) in getSteps">
      <div
        class="step"
        :key="index"
        @click="goTo(step)"
        v-on:keyup.tab="goTo(step)"
        :class="{'active-step': isCurrentStep(step)}"
      >
        <div class="step__indicator">
          <div class="step__line"></div>
          <v-btn
            outlined fab
            color="primary"
            :id=step.id
            class="step__btn"
            tabindex="-1"
            :disabled=isBusySaving
            :ripple="false"
            :class="{ 'selected-btn': isCurrentStep(step) }"
          >
            <v-icon class="step__icon" :class="{ 'selected-icon': isCurrentStep(step) }">{{ step.icon }}</v-icon>
          </v-btn>
          <v-icon class="step__btn2" size="30" color="success darken-1" v-show="isValid(step.to)">
            mdi-check-circle
          </v-icon>
          <v-icon class="step__btn2" size="30" color="error darken-1"
            v-show="!isValid(step.to) && getShowErrors && getValidateSteps">
            mdi-close-circle
          </v-icon>
        </div>
        <v-btn
          class="step__label pre-line px-3"
          text
          :ripple="false"
          :disabled=step.disabled
          :class="[{'active__btn__text': isCurrentStep(step)}, 'inactive__btn__text']"
        >
          {{ step.text }}
        </v-btn>
      </div>
    </template>
  </v-card>
</template>

<script lang="ts">
// Libraries
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { Getter } from 'vuex-class'

// Enums
import { RouteNames } from '@/enums'
import { RegistrationStateIF, RestorationStateIF } from '@/interfaces'

@Component({})
export default class Stepper extends Vue {
  @Getter getRegistration!: RegistrationStateIF
  @Getter getRestoration!: RestorationStateIF
  @Getter getShowErrors!: boolean
  @Getter getSteps!: Array<any>
  @Getter getValidateSteps!: boolean
  @Getter isAddPeopleAndRolesValid!: boolean
  @Getter isAffidavitValid!: boolean
  @Getter isBusySaving!: boolean
  @Getter isCreateShareStructureValid!: boolean
  @Getter isDefineCompanyValid!: boolean
  @Getter isDissolutionDefineDissolutionValid!: boolean
  @Getter isDissolutionValid!: boolean
  @Getter isIncorporationAgreementValid!: boolean
  @Getter isIncorporationApplicationValid!: boolean
  @Getter isMemorandumValid!: boolean
  @Getter isRegistrationValid!: boolean
  @Getter isResolutionValid!: boolean
  @Getter isRestorationValid!: boolean
  @Getter isRulesValid!: boolean

  /** Returns true if the step route is valid. */
  protected isValid (route: RouteNames): boolean {
    switch (route) {
      case RouteNames.DISSOLUTION_AFFIDAVIT: return this.isAffidavitValid
      case RouteNames.DISSOLUTION_DEFINE_DISSOLUTION: return this.isDissolutionDefineDissolutionValid
      case RouteNames.DISSOLUTION_RESOLUTION: return this.isResolutionValid
      case RouteNames.DISSOLUTION_REVIEW_CONFIRM: return this.isDissolutionValid

      case RouteNames.INCORPORATION_AGREEMENT: return this.isIncorporationAgreementValid
      case RouteNames.INCORPORATION_DEFINE_COMPANY: return this.isDefineCompanyValid
      case RouteNames.INCORPORATION_MEMORANDUM: return this.isMemorandumValid
      case RouteNames.INCORPORATION_PEOPLE_ROLES: return this.isAddPeopleAndRolesValid
      case RouteNames.INCORPORATION_REVIEW_CONFIRM: return this.isIncorporationApplicationValid
      case RouteNames.INCORPORATION_RULES: return this.isRulesValid
      case RouteNames.INCORPORATION_SHARE_STRUCTURE: return this.isCreateShareStructureValid

      case RouteNames.REGISTRATION_DEFINE_BUSINESS: return this.getRegistration.defineBusinessValid
      case RouteNames.REGISTRATION_PEOPLE_ROLES: return this.isAddPeopleAndRolesValid
      case RouteNames.REGISTRATION_REVIEW_CONFIRM: return this.isRegistrationValid

      case RouteNames.RESTORATION_APPLICANT_INFORMATION: return this.isAddPeopleAndRolesValid
      case RouteNames.RESTORATION_BUSINESS_INFORMATION: return this.getRestoration.businessInfoValid
      case RouteNames.RESTORATION_BUSINESS_NAME: return this.getRestoration.businessNameValid
      case RouteNames.RESTORATION_REVIEW_CONFIRM: return this.isRestorationValid
    }
    return false
  }

  protected goTo (step) {
    this.$router.push(step.to).catch(() => {})
  }

  protected isCurrentStep (step): boolean {
    return this.$route.name === step.to
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#step-buttons-container {
  display: flex;
  justify-content: space-evenly;
  margin: 0;
  padding: 0;
  background-color: $BCgovInputBG;
}

.v-btn:before {
  background-color: $BCgovInputBG !important;
}

.step {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  align-items: center;
  justify-content: center;
  padding: 1.75rem 0;
  border-bottom: 3px solid transparent;
}

.active-step {
  border-bottom: 3px solid $app-blue;
  border-bottom-left-radius: initial !important;
  border-bottom-right-radius: initial !important;
}

.step:hover {
  cursor: pointer;

  .step__btn {
    background: linear-gradient(rgba(25,118,210, 1), rgba(25,118,210, 1)),
                linear-gradient(rgba(255, 255, 255, 1), rgba(255, 255, 255, 1)); // first bg is layered on top
    color: $BCgovInputBG;
  }

  .v-btn:before {
    background-color: $app-blue;
  }

  .step__icon {
    color: $BCgovInputBG;
    background-color: inherit;
  }
}

.selected-btn {
  background-color: $app-blue !important;
}

.selected-icon {
  color: $BCgovInputBG !important;
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
  height: 1px;
  width: 100%;
  background-color: $gray5;
  transform: translateX(-50%);
}

.step:first-child .step__line {
  display: none;
}

.step__btn {
  position: relative;
  background-color: $BCgovInputBG;
  z-index: 1; // on top of step line

  .step__icon {
    color: $app-blue;
    background-color: inherit;
  }
}

.step__btn2 {
  position: absolute;
  margin-top: -5px;
  margin-left: -16px;
  background-color: $BCgovInputBG;
  border-radius: 50%;
  z-index: 1; // on top of step line and step btn
}

.step__label {
  margin-top: 10px;
  text-align: center;
}

.active__btn__text {
  font-weight: bold;
  color: $gray9 !important;
}

.inactive__btn__text {
  color: $app-blue;
}

// Vuetify Overrides
:deep() {
  .v-btn:not(.v-btn--round).v-size--default {
    max-width: 64px;
  }

  .v-card > *:last-child:not(.v-btn):not(.v-chip) {
    border-bottom: 3px solid red !important;
    border-bottom-left-radius: 2px !important;
  }
}
</style>
