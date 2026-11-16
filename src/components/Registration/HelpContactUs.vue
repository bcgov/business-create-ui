<template>
  <div id="help-contact-us">
    <div
      class="help-btn"
      @click="helpToggle = !helpToggle"
    >
      <v-icon
        color="primary"
        class="mt-n1"
      >
        mdi-help-circle-outline
      </v-icon>
      <span
        v-if="!helpToggle"
        class="pl-2"
      >{{ content.helpText }}</span>
      <span
        v-else
        class="pl-2"
      >Hide Help</span>
    </div>

    <v-expand-transition>
      <section
        v-if="helpToggle"
        class="help-section"
      >
        <header class="help-header">
          <h2 class="py-4 px-0">
            {{ content.title }}
          </h2>
        </header>

        <p
          v-for="(paragraph, index) in content.body"
          :key="index"
          class="my-4"
          v-html="paragraph"
        />

        <FirmContactInfo />

        <div
          class="help-btn bottom"
          @click="helpToggle = !helpToggle"
        >
          Hide Help
        </div>
      </section>
    </v-expand-transition>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import FirmContactInfo from '@/components/common/FirmContactInfo.vue'

interface HelpContent {
  helpText: string
  title: string
  body: string[]
}

export type HelpType = 'proprietor' | 'partner' | 'default'

const CONTACT_US =
  'If you are having trouble finding your active business, you can contact us for help.'

const HELP_CONTENT: Record<HelpType, HelpContent> = {
  proprietor: {
    helpText: 'Help with Adding a Business as the Proprietor',
    title: 'Help with Adding a Business as the Proprietor',
    body: [
      'To add a business as the proprietor of the sole proprietorship, enter the business name or the ' +
        'incorporation/registration number of the active B.C. business you are trying to add.',
      'A sole proprietorship can be owned by any active business registered or incorporated in B.C., ' +
        '<strong>except</strong> for an existing sole proprietorship.',
      CONTACT_US
    ]
  },
  partner: {
    helpText: 'Help with adding a business as a Partner',
    title: 'Help with Adding a Business as a Partner',
    body: [
      'To add a business as a partner for this general partnership, enter the business name or the ' +
        'incorporation/registration number of the active B.C. business you are trying to add.',
      'A general partnership can have any active business registered or incorporated in B.C. as a partner.',
      CONTACT_US
    ]
  },
  default: {
    helpText: 'Need Help? Contact Us',
    title: 'Contact BC Registries',
    body: ['If you require further assistance adding a business, please contact us.']
  }
}

@Component({
  components: {
    FirmContactInfo
  }
})
export default class HelpContactUs extends Vue {
  /** Which set of help copy to show. */
  @Prop({ default: 'default' }) readonly type!: HelpType

  helpToggle = false

  /** The help text, title and body for the current type. */
  get content (): HelpContent {
    return HELP_CONTENT[this.type] || HELP_CONTENT.default
  }
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

:deep(.contact-container) {
  font-size: $px-16;
  line-height: 24px;
}
</style>
