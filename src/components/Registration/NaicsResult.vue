<template>
  <v-row no-gutters class="naics-result" v-if="!!result" @click="emitClick(result)">
    <v-col cols="2">
      <div class="result-code">{{result.code}}</div>
    </v-col>

    <v-col cols="10">
      <label class="result-class-title">{{result.classTitle}}</label>

      <div class="result-class-definition">{{result.classDefinition}}</div>

      <template v-if="elements.length > 0">
        <div class="sample-activities">Sample activities:</div>
        <ul>
          <template v-for="(element, index) in elements">
            <li v-if="showMore || (index < 5)" :key="index">
              {{capitalize(element.elementDescription)}}
            </li>
          </template>
        </ul>

        <div v-if="!showMore && (elements.length >= 5)" class="show-more" @click.stop="showMore = true">
          Show more...
        </div>
      </template>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { NaicsElementIF, NaicsResultIF } from '@/interfaces'
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'

@Component({})
export default class NaicsResult extends Vue {
  @Prop({ required: true })
  readonly result!: NaicsResultIF

  @Emit('click')
  private emitClick (result: NaicsResultIF): void {}

  // local variables
  showMore = true // FUTURE: change to 'false' to enable this feature

  get elements (): NaicsElementIF[] {
    return this.result?.naicsElements || []
  }

  /** Returns the string with the first character capitalized. */
  capitalize (s: string): string {
    return s.replace(/^\w/, c => c.toUpperCase())
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.naics-result {
  padding: 1.5rem;
  font-size: $px-14;
  color: $gray7;
  border-bottom: 1px solid $gray3;

  &:hover {
    background-color: $app-lt-blue;
  }
}

.result-code,
.result-class-title {
  cursor: pointer;
  font-size: $px-16;
  color: $app-blue;
}

.result-class-definition {
  padding-top: 1rem;
}

.sample-activities {
  padding-top: 1rem;
  font-weight: bold;
}

ul {
  padding-top: 0.25rem;
}

.show-more {
  cursor: pointer;
  color: $app-blue;
}
</style>
