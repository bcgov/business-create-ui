<template>
  <div id="naics-help-text">
    <p>If you are having difficulty locating a NAICS code, try the following:</p>
    <ul>
      <li>Use more general terms (for example, instead of searching 'imported shoe
        sales', try 'shoe').</li>
      <li>Remove pluralization or unnecessary endings (for example, instead of
        searching 'deliveries', try 'deliver').</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class NaicsHelpText extends Vue {}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#naics-help-text {
  font-size: $px-16;
  color: $gray7;
}

li {
  font-size: $px-14;
  margin-left: -0.25rem;
}

li:last-of-type {
  margin-top: 0.25rem;
}
</style>
