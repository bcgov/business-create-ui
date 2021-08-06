<template>
  <v-card flat class="px-5 py-6" id="document-delivery">
    <v-row class="py-3" no-gutters>
      <v-col :cols="3">
        <label class="font-weight-bold">Registered Office</label>
      </v-col>
      <v-col :cols="9">
        <v-card-text id="office-email" class="pa-0">{{getBusinessContact.email || 'Not entered'}}</v-card-text>
      </v-col>
    </v-row>
    <v-row class="py-3" no-gutters>
      <v-col :cols="3">
        <label class="font-weight-bold">Completing Party</label>
      </v-col>
      <v-col :cols="9">
        <v-card-text id="completing-party-email" class="pa-0">{{getCompletingPartyEmail || 'Not entered'}}</v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
// Libraries
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'

// Interfaces
import { BusinessContactIF } from '@/interfaces'

@Component({})
export default class DocumentDelivery extends Vue {
  @Getter getBusinessContact!: BusinessContactIF
  @Getter getCompletingPartyEmail!: string
}
</script>

<style lang="scss" scoped>
</style>
