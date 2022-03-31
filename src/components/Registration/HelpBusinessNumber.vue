<template>
  <div id="help-business-number">
    <div class="help-btn" @click="helpToggle = !helpToggle">
      <v-icon color="primary">mdi-help-circle-outline</v-icon>
      <span v-if="!helpToggle" class="pl-2">{{ header }}</span>
      <span v-else class="pl-2">Hide Help</span>
    </div>

    <v-expand-transition>
      <section v-if="helpToggle" class="help-section">
        <header class="help-header">
          <h2 class="py-4 px-0">{{ header }}</h2>
        </header>

        <p class="my-4">
          The supplied business number will be used to link this registration with
          <a :href="ProgramAccountUrl" target="_blank">
            a program account by Canada Revenue Agency
            <v-icon dense color="primary">mdi-open-in-new</v-icon>
          </a>.
          You will have a business number if the sole proprietorship you are
          registering already has one of the following accounts:
        </p>

        <ul class="bulleted-list">
          <li>Goods and services tax/harmonized sales tax (GST/HST)</li>
          <li>Payroll deductions</li>
          <li>Import/export</li>
          <li>Provincial sales tax (PST)</li>
          <li>WorkSafeBC</li>
        </ul>

        <p class="my-4">
          You can find your business number on the correspondence sent to you for the
          accounts listed above.
        </p>

        <template v-if="isTypeSoleProp">
          <p class="my-4">
            You may also have a business number that you can use for this registration if the
            following applies:
          </p>

          <ul class="bulleted-list">
            <li>You are an individual registering a sole proprietorship: you may already have
              a business number if you have previously registered a sole proprietorship (in
              any province) as an individual.</li>
          </ul>
        </template>

        <p class="my-4">
          Please contact the Canada Revenue Agency (CRA) at 1-800-959-5525 if you have
          forgotten or can't find your business number.
        </p>

        <p class="my-4">
          To learn more,
          <a :href="BusNumInfoUrl" target="_blank">
            visit the Business Number information page
            <v-icon dense color="primary">mdi-open-in-new</v-icon>
          </a>.
        </p>

        <div class="help-btn bottom" @click="helpToggle = !helpToggle">Hide Help</div>
      </section>
    </v-expand-transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'

@Component({})
export default class HelpBusinessNumber extends Vue {
  @Getter isTypeSoleProp!: boolean

  readonly header = 'Help with Business Number'
  readonly ProgramAccountUrl = 'https://www.canada.ca/en/revenue-agency/services/tax/businesses/' +
    'topics/registering-your-business/you-need-a-business-number-a-program-account.html'
  readonly BusNumInfoUrl = 'https://www2.gov.bc.ca/gov/content/employment-business/business/' +
    'managing-a-business/permits-licences/businesses-incorporated-companies/business-number'

  // local variable
  helpToggle = false
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.help-btn {
  cursor: pointer;
  color: $app-blue;
  vertical-align: middle;
}

.v-icon {
  color: $gray9;
  margin-top: -3px;
}

.help-section {
  color: $gray7;
  border-top: 1px dashed $gray6;
  border-bottom: 1px dashed $gray6;
  margin: 1.5rem 0;
  padding: 1rem 0;
}

.help-header {
  display: flex;
  justify-content: center;
}

a {
  text-decoration: none;
}

.help-btn.bottom {
  font-size: $px-13;
  text-decoration: underline;
  display: flex;
  direction: rtl;
}
</style>
