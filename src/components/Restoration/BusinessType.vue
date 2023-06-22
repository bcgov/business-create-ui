<template>
  <div id="business-type">
    <div class="section-container">
      <v-row no-gutters>
        <v-col
          cols="12"
          sm="3"
          class="pr-4"
        >
          <label>
            <strong>Business Type</strong>
          </label>
        </v-col>

        <v-col
          cols="12"
          sm="9"
          class="pt-4 pt-sm-0"
        >
          {{ businessType }}
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module/'
import { CorpTypeCd } from '@bcrs-shared-components/enums/'

@Component({})
export default class BusinessType extends Vue {
  @Getter(useStore) getEntityType!: CorpTypeCd

  get businessType (): string {
    return GetCorpFullDescription(this.getEntityType)
  }
}
</script>
