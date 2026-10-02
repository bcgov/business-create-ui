<template>
  <MessageBox color="red">
    <div class="d-flex align-start ml-n2">
      <v-icon
        class="message-box-warning-icon mr-2"
        :color="iconColour"
        dense
      >
        {{ iconName }}
      </v-icon>
      <div>
        <p
          v-for="(msg, index) in messages"
          :key="index"
          :class="{ 'mb-0': (index === messages.length - 1) }"
        >
          <strong v-if="msg.prefix">{{ msg.prefix }}</strong>
          {{ msg.message }}
        </p>
      </div>
    </div>
  </MessageBox>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import MessageBox from '@/components/common/MessageBox.vue'

/** A red MessageBox with a leading icon and a list of messages (optionally bold-prefixed). */
@Component({
  components: { MessageBox }
})
export default class MessageBoxWarning extends Vue {
  /** The icon to display (eg, "mdi-alert"). */
  @Prop({ required: true }) readonly iconName!: string

  /** The icon colour (eg, "error"). */
  @Prop({ required: true }) readonly iconColour!: string

  /** The paragraphs to display, each with an optional bold prefix. */
  @Prop({ default: () => [] }) readonly messages!: Array<{ prefix?: string, message: string }>
}
</script>

<style lang="scss" scoped>
.message-box-warning-icon {
  // bottom-align the icon with the bottom of the first line of text
  margin-top: 2px;
}
</style>
