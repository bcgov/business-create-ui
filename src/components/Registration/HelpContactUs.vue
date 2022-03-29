<template>
  <div id="help-contact-us">
    <div class="help-btn" @click="helpToggle = !helpToggle">
      <v-icon color="primary" class="mt-n1">mdi-help-circle-outline</v-icon>
      <span v-if="!helpToggle" class="pl-2">Need Help? Contact Us</span>
      <span v-else class="pl-2">Hide Help</span>
    </div>

    <v-expand-transition>
      <section v-if="helpToggle" class="help-section">
        <header class="help-header">
          <h2 class="py-4 px-0">Contact BC Registries</h2>
        </header>

        <p class="my-4">
          If you require further assistance adding a business or corporation, please contact us.
        </p>

        <RegistriesContactInfo />

        <div class="help-btn bottom" @click="helpToggle = !helpToggle">Hide Help</div>
      </section>
    </v-expand-transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import RegistriesContactInfo from '@/components/common/RegistriesContactInfo.vue'

@Component({
  components: { RegistriesContactInfo }
})
export default class HelpContactUs extends Vue {
  readonly header = 'Contact BC Registries'

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

.help-btn.bottom {
  font-size: $px-13;
  text-decoration: underline;
  display: flex;
  direction: rtl;
}

::v-deep .contact-container {
  font-size: $px-16;
  line-height: 24px;
}
</style>
