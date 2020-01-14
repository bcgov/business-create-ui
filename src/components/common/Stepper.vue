<template>
  <v-container id="step-buttons-container" class="list-item justify-space-between">
    <v-btn id="step-1-btn" large to="/define-company" :disabled="isBusySaving">
      <span>1. Define Your<br>Company</span>
    </v-btn>

    <!-- Benefit Company steps -->
    <template v-if="isTypeBcomp">
      <v-btn id="step-2-btn" large disabled>
        <span>2. Add People<br>and Roles</span>
      </v-btn>

      <v-btn id="step-3-btn" large disabled>
        <span>3. Create Share<br>Structure</span>
      </v-btn>

      <v-btn id="step-4-btn" large disabled>
        <span>4. Incorporation<br>Agreement</span>
      </v-btn>

      <v-btn id="step-5-btn" large to="/review-confirm" :disabled="isBusySaving">
        <span>5. Review<br>and Confirm</span>
      </v-btn>
    </template>

    <!-- Cooperative Association steps -->
    <template v-else-if="isTypeCoop">
      <v-btn id="step-2-btn" large disabled>
        <span>2. Add People<br>and Roles</span>
      </v-btn>

      <v-btn id="step-3-btn" large disabled>
        <span>3. Create<br>Rules</span>
      </v-btn>

      <v-btn id="step-4-btn" large disabled>
        <span>4. Create<br>Memorandum</span>
      </v-btn>

      <v-btn id="step-5-btn" large to="/review-confirm" :disabled="isBusySaving">
        <span>5. Review<br>and Confirm</span>
      </v-btn>
    </template>

    <!-- TBD -->
    <template v-else>
      <v-btn id="step-2-btn" large disabled>&hellip;</v-btn>
      <v-btn id="step-3-btn" large disabled>&hellip;</v-btn>
      <v-btn id="step-4-btn" large disabled>&hellip;</v-btn>
      <v-btn id="step-5-btn" large disabled>&hellip;</v-btn>
    </template>
  </v-container>
</template>

<script lang="ts">
// Libraries
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'

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
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#step-buttons-container {
  background: $BCgovInputBG;
}
</style>
