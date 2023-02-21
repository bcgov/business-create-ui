<template>
  <div id="business-type">
    <div class="section-container">
      <v-row no-gutters>
        <v-col cols="12" sm="3" class="pr-4">
          <label>
            <strong>Business Type</strong>
          </label>
        </v-col>

        <v-col cols="12" sm="9" class="pt-4 pt-sm-0">
          {{ businessType }}
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module/'

@Component({})
export default class BusinessType extends Vue {
  @Getter getEntityType!: CorpTypeCd

  get businessType (): string {
    return GetCorpFullDescription(this.getEntityType)
  }
}
</script>
