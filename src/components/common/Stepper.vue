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
            :class="{ 'selected-btn': isCurrentStep(step) }">
            <v-icon class="step__icon" :class="{ 'selected-icon': isCurrentStep(step) }">{{ step.icon }}</v-icon>
          </v-btn>
          <v-icon class="step__btn2" size="30" color="success darken-1" v-show=isValid(step.to)>
            mdi-check-circle
          </v-icon>
          <v-icon class="step__btn2" size="30" color="error darken-1" v-show="!isValid(step.to) && getValidateSteps">
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
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'

// Enums
import { RouteNames } from '@/enums'

@Component({})
export default class Stepper extends Vue {
  @Getter getSteps!: Array<any>
  @Getter isBusySaving!: boolean
  @Getter isDefineCompanyValid!: boolean
  @Getter isAddPeopleAndRolesValid!: boolean
  @Getter isRulesValid!: boolean
  @Getter isMemorandumValid!: boolean
  @Getter isResolutionValid!: boolean
  @Getter isCreateShareStructureValid!: boolean
  @Getter isIncorporationAgreementValid!: boolean
  @Getter isApplicationValid!: boolean
  @Getter getValidateSteps!: boolean

  /** Returns true if the step route is valid. */
  private isValid (route: RouteNames): boolean {
    switch (route) {
      case RouteNames.DEFINE_COMPANY:
        return this.isDefineCompanyValid

      case RouteNames.ADD_PEOPLE_AND_ROLES:
        return this.isAddPeopleAndRolesValid

      case RouteNames.CREATE_RULES:
        return this.isRulesValid

      case RouteNames.CREATE_SHARE_STRUCTURE:
        return this.isCreateShareStructureValid

      case RouteNames.INCORPORATION_AGREEMENT:
        return this.isIncorporationAgreementValid

      case RouteNames.CREATE_MEMORANDUM:
        return this.isMemorandumValid

      case RouteNames.CREATE_RESOLUTION:
        return this.isResolutionValid

      case RouteNames.REVIEW_CONFIRM:
        return this.isApplicationValid

      default:
        return false
    }
  }

  private goTo (step) {
    this.$router.push(step.to).catch(error => error)
  }

  private isCurrentStep (step): boolean {
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
  background: $BCgovInputBG;
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
    background: inherit;
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
  z-index: 2;
  .step__icon {
    color: $app-blue;
    background-color: inherit;
  }
}

.step__btn2 {
  position: absolute;
  margin-top: -5px;
  margin-left: -16px;
  background: $BCgovInputBG;
  border-radius: 50%;
  z-index: 3;
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
::v-deep .v-btn:not(.v-btn--round).v-size--default {
  max-width: 64px;
}

::v-deep .v-card > *:last-child:not(.v-btn):not(.v-chip) {
  border-bottom: 3px solid red !important;
  border-bottom-left-radius: 2px !important;
}
</style>
