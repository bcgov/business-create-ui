<template>
  <div class="button-container" v-if="webChatUrl && webChatReason">
    <v-form
      id="webchat"
      target="webchat_window"
      method="post"
      :action="webChatUrl"
      @submit="onSubmit()"
    >
      <input
        type="hidden"
        name="Reason"
        :value="webChatReason"
      />
      <input
        type="hidden"
        name="UserLanguage"
        value="en"
      />
      <input
        type="hidden"
        name="Parameters[TimeZoneOffset]"
        :value="timeZoneOffset"
      />

      <v-tooltip top content-class="top-tooltip" nudge-top="5" :disabled="isMobile">
        <template v-slot:activator="{ on, attrs }">
          <div id="chat-button-wrapper" v-on="on" v-bind="attrs">
            <v-btn
              :disabled="(chatStatus !== 'open')"
              large
              outlined
              color="bcgovblue"
              elevation="4"
              class="chat-button"
              type="submit"
              v-bind="attrs"
              v-on="on"
              aria-label="Chat with Helpdesk staff">
              <v-icon class="mr-2 ml-n2">mdi-forum-outline</v-icon>
              <span class="font-weight-bold">Chat</span>
            </v-btn>
          </div>
        </template>
        <span v-if="chatStatus === 'open'" id="open-tooltip-message" >
          Click here to chat live with Helpdesk staff about Name Requests.
        </span>
        <span v-else-if="chatStatus === 'closed'" id="closed-tooltip-message" >
          We are closed. The Service BC Contact Centre is open Monday through Friday 7:30am – 5:00pm Pacific Time
          excluding BC statutory holidays.
        </span>
        <span v-else id="unavailable-tooltip-message">Webchat is temporarily unavailable.</span>
      </v-tooltip>
    </v-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import axios from 'axios'
import { Getter } from 'vuex-class'

@Component({})
export default class ChatPopup extends Vue {
  // Global getter
  @Getter isMobile!: boolean

  readonly webChatReason = window['webChatReason'] as string
  readonly webChatStatusUrl = window['webChatStatusUrl'] as string
  readonly webChatUrl = window['webChatUrl'] as string

  chatStatus = 'unknown'

  /** The user's browser's tz offset (not necessarily Pacific time). */
  get timeZoneOffset (): number {
    return new Date().getTimezoneOffset() / 60
  }

  async mounted (): Promise<void> {
    if (this.webChatStatusUrl) {
      this.chatStatus = await axios
        .get(this.webChatStatusUrl)
        .then(response => {
          return response.data?.status || 'response error'
        })
        .catch(error => {
          console.error('failed to get webchat status, error =', error) // eslint-disable-line no-console
          return error.response?.statusText || 'network error'
        })
    }
  }

  onSubmit (): void {
    window.open('about:blank', 'webchat_window', 'width=400, height=500')
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/theme.scss';

.button-container {
  position: fixed;
  bottom: -1px;
  right: 1rem;
  z-index: 999;
}

.chat-button {
  margin-bottom: -1px;
  min-height: 40px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
  background-color: #ffffff !important;
}

.v-tooltip__content {
  padding: 1rem !important;
  background-color: rgba(0,0,0,0.85) !important;
  line-height: 1.75rem;
}

.top-tooltip {
  max-width: 12rem;
}

.top-tooltip:after {
  border-top: 8px solid rgba(0,0,0,0.85) !important;
}

/** Vuetify var() colors don't work in IE11, so just specify them here */
.bcgovblue--text {
  color: $BCgovBlue5 !important;
  caret-color: $BCgovBlue5 !important;
}
</style>
