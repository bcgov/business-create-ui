<template>
  <div id="create-rules">
    <UploadRules class="mt-4" />
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Vue } from 'vue-property-decorator'

// Components
import { UploadRules } from '@/components/CreateRules'

@Component({
  components: {
    UploadRules
  }
})
export default class CreateRules extends Vue {}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';
</style>
