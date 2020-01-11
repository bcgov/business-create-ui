<template>
  <div id="entity-info">
    <v-container>
      <v-list-item three-line>

        <!---Initial Header --->
        <v-list-item-content id="no-nr-header" v-show="!nameReqData">

          <!-- Intro Title -->
          <v-list-item-title class="header-title" id="entity-title">
            <span>Register a BC Business</span>
          </v-list-item-title>
        </v-list-item-content>

        <!--- Name Request Header --->
        <v-list-item-content id="nr-header" v-show="nameReqData">

          <!-- Subtitle -->
          <v-list-item-subtitle class="entity-subtitle">
            <span>Register a BC Benefit Company</span>
          </v-list-item-subtitle>

          <!-- Company Name -->
          <v-list-item-title class="header-title" id="entity-legal-name">
            <span>XYZ.inc</span>
          </v-list-item-title>

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
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class EntityInfo extends Vue {
  // Local Properties
  // Boolean representing the presence of a Name Request Response
  // *Temp: To be determined dynamically based on API Response from Name Request*
  private nameReqData: boolean | undefined = false
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#entity-info {
  background: $BCgovInputBG;
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
