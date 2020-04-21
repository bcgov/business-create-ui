<template>
  <v-card flat id="incorporation-date-time">
    <v-row>
      <v-spacer></v-spacer>
      <v-col cols="12" sm="6" md="4">
        <h3>Incorporation Date and Time</h3>
      </v-col>
      <v-col cols="12" sm="6" md="4">

        <v-radio-group
          column
          class="radio-group">
          <v-radio
            :value="true"
            v-model="isImmediate"
            label="Immediate (Upon Filing)">
          </v-radio>
          <v-radio
            :value="false"
            v-model="hasEffectiveDatetime"
            label="A date / time in the future">
          </v-radio>
          <v-radio :value="true" label="No maximum" id="lbl-no-maximum" v-if="isNoMaxSharesVisible"/>
        </v-radio-group>

        <v-menu
          v-model="menu2"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="date"
              :rules="false"
              placeholder="Date"
              append-icon="mdi-calendar"
              v-on="on"
              readonly
              filled
            />
          </template>
          <v-date-picker v-model="date" @input="menu2 = false"></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" sm="6" md="4"></v-col>
      <v-spacer></v-spacer>
    </v-row>
  </v-card>
</template>

<script lang="ts">
// Libraries
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'

// Interfaces
import { DateTimeIF } from '@/interfaces'

@Component({})
export default class IncorporationDateTime extends Vue {
  private isImmediate: boolean
  private hasEffectiveDatetime: boolean
}
</script>

<style lang="scss" scoped>
  #incorporation-date-time {
    margin-top: 1rem;
  }
</style>
