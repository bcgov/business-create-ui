<template>
  <div id="create-memorandum">
    <UploadMemorandum class="mt-4" />
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Vue } from 'vue-property-decorator'

// Components
import { UploadMemorandum } from '@/components/CreateMemorandum'

@Component({
  components: {
    UploadMemorandum
  }
})
export default class CreateMemorandum extends Vue {}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';
</style>
