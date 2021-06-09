<template>
  <v-container id="step-buttons-container">
    <template v-for="(step, index) in getSteps">
      <div class="step" :key="index" @click="goTo(step)" v-on:keyup.tab="goTo(step)">
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
          <v-icon class="step__btn2" size="30" color="green darken-1" v-show=isValid(step.to)>
            mdi-check-circle
          </v-icon>
          <v-icon class="step__btn2" size="30" color="red darken-1" v-show="!isValid(step.to) && getValidateSteps">
            mdi-close-circle
          </v-icon>
        </div>
        <v-btn class="step__label pre-line" text color="primary" :ripple="false" :disabled=step.disabled>
          {{ step.text }}
        </v-btn>
      </div>
    </template>
  </v-container>
</template>

<script lang="ts">
// Libraries
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'

// Interfaces
import { RouteNames } from '@/enums'

@Component({})
export default class Stepper extends Vue {
  @Getter getSteps!: Array<any>
  @Getter isBusySaving!: boolean
  @Getter isDefineCompanyValid!: boolean
  @Getter isAddPeopleAndRolesValid!: boolean
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

      case RouteNames.CREATE_SHARE_STRUCTURE:
        return this.isCreateShareStructureValid

      case RouteNames.INCORPORATION_AGREEMENT:
        return this.isIncorporationAgreementValid

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
  padding: 2rem 0;
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
}

.step:hover {
  cursor: pointer;

  .step__btn {
    background: linear-gradient(rgba(25,118,210, .8), rgba(25,118,210, .8)),
                linear-gradient(rgba(255, 255, 255, 1), rgba(255, 255, 255, 1)); // first bg is layered on top
    color: $BCgovInputBG;
  }

  .v-btn:before {
    background-color: #1976d2;
  }

  .step__icon {
    color: $BCgovInputBG;
    background: inherit;
  }
}

.selected-btn {
  background-color: #1976d2 !important;
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
  height: 2px;
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
    color: #1976d2;
    background-color: inherit;
  }
}

.step__btn2 {
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
