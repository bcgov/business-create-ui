<template>
  <div id="entity-info">
    <v-container>
      <v-list-item three-line id="entity-info-header">

        <!-- Initial Header -->
        <v-list-item-content id="no-nr-header" v-show="!isEntityType">

          <!-- Intro Title -->
          <v-list-item-title class="header-title" id="entity-title">
            <span>Register a BC Business</span>
          </v-list-item-title>

        </v-list-item-content>

        <!-- Header With NR Data -->
        <v-list-item-content id="nr-header" v-show="isEntityType">

          <!-- Subtitle -->
          <v-list-item-subtitle class="entity-subtitle">
            <span v-if="isTypeBcomp">Incorporate a BC Benefit Company</span>
            <span v-if="isTypeCoop">Incorporate a BC Cooperative Association</span>
          </v-list-item-subtitle>

          <!-- Company Name -->
          <v-list-item-title class="header-title" id="entity-legal-name">
            <span>XYZ Inc.</span>
          </v-list-item-title>

          <!-- TODO: display Designation? See mockup. -->

          <!-- Company Number -->
          <v-list-item-subtitle class="business-info">
            <dl>
              <dt>Name Request No:</dt>
              <dd class="ml-2" id="entity-nr-number">
                <span>NR1234567</span>
              </dd>
            </dl>
          </v-list-item-subtitle>

        </v-list-item-content>

      </v-list-item>
    </v-container>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Vue } from 'vue-property-decorator'
import { State, Getter } from 'vuex-class'

// Interfaces
import { TombStoneIF, GetterIF } from '@/interfaces'

@Component
export default class EntityInfo extends Vue {
  // Global getters
  @Getter isEntityType!: GetterIF
  @Getter isTypeBcomp!: GetterIF
  @Getter isTypeCoop!: GetterIF
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#entity-info {
  background: $BCgovInputBG;
}

#entity-info-header {
  padding: 0!important;
}

.container {
  padding-top: .5rem;
  padding-bottom: .5rem;
}

.header-title {
  font-size: 1.25rem;
  font-weight: bold;
}

.business-info {
  display: flex;
  justify-content: space-between;
}

dl {
  display: inline-block;
  overflow: hidden;
  color: $gray6;
}

dd, dt {
  float: left;
}

dt {
  position: relative;
}

dd + dt:before {
  content: "•";
  display: inline-block;
  margin-right: 0.75rem;
  margin-left: 0.75rem;
}
</style>
