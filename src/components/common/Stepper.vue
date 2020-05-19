<template>
  <v-container id="step-buttons-container">
    <template v-for="(step, index) in getSteps">
      <div class="step" :key="index">
        <div class="step__indicator">
          <div class="step__line"></div>
          <v-btn class="step__icon" :id=step.id outlined fab color="primary" :to=step.to :disabled=step.disabled>
            <v-icon>{{step.icon}}</v-icon>
          </v-btn>
          <v-icon class="step__icon2" size="30" color="green darken-1" v-show=step.valid>
            mdi-check-circle
          </v-icon>
        </div>
        <v-btn class="step__label pre-line" text color="primary" :to=step.to :disabled=step.disabled>
          {{step.text}}
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
import { GetterIF } from '@/interfaces'

@Component({})
export default class Stepper extends Vue {
  @Getter getSteps!: GetterIF
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
