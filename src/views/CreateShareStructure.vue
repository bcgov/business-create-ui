<template>
  <section class="mt-10">
    <header id="share-structure-header">
      <h2>1. Create Your Authorized Share Structure</h2>
    </header>
    <p>
      Add at least one class of shares. A share class consists of the name of the class, the maximum number of shares in
      the class (including any associated Series), a par value for the class, and the currency the shares are valued in.
    </p>
    Your application must include the following:
    <ul>
      <li>
        <v-icon color="blue" v-if="shareClasses.length > 0" class="cp-valid">mdi-check</v-icon>
        <span v-else><v-icon color="red" v-if="showErrors" class="cp-invalid">mdi-close</v-icon></span>
        <span class="chk-list-item-txt">At least one Class of Shares</span>
      </li>
    </ul>
    <div class="btn-panel">
      <v-btn outlined color="primary"  id="btn-start-add-cp"
      :disabled="showShareStructureForm"
      @click="initNewShareClass()" >
        <v-icon>mdi-plus</v-icon>
        <span>Add Share Class</span>
      </v-btn>
    </div>
    <v-card flat class="add-share-structure-container" v-if="showShareStructureForm">
      <ShareStructure
        v-show="showShareStructureForm"
        :initialValue="currentShareStructure"
        :activeIndex="activeIndex"
        :nextId="nextId"
        :parentIndex="parentIndex"
        :shareClasses="shareClasses"
        @addEditClass="addEditShareClass($event)"
        @addEditSeries="addEditShareSeries($event)"
        @removeClass="removeShareClass($event)"
        @removeSeries="removeSeries"
        @resetEvent="resetData()"/>
    </v-card>
    <ListShareClass v-if="this.shareClasses.length > 0"
    :shareClasses="shareClasses"
    :componentDisabled="showShareStructureForm"
    @editClass="initShareClassForEdit($event)"
    @removeClass="removeShareClass($event)"
    @addSeries="initNewShareSeries($event)"
    @editSeries="editSeries"
    @removeSeries="removeSeries"/>
  </section>
</template>

<script lang="ts">
// Libraries
import { Component, Vue } from 'vue-property-decorator'
import { Action, State } from 'vuex-class'

// Interfaces
import { ActionBindingIF, FormType, ShareClassIF } from '@/interfaces'

// Components
import { ListShareClass, ShareStructure } from '@/components/CreateShareStructure'

@Component({
  components: {
    ListShareClass,
    ShareStructure
  }
})
export default class CreateShareStructure extends Vue {
  // State
  @State(state => state.stateModel.createShareStructureStep.shareClasses)
  readonly shareClasses: ShareClassIF[]

  // Actions
  @Action setShareClasses!: ActionBindingIF
  @Action setCreateShareStructureStepValidity!: ActionBindingIF

  private newShareClass: ShareClassIF = {
    id: null,
    priority: null,
    type: 'Class',
    name: '',
    hasMaximumShares: true,
    maxNumberOfShares: null,
    hasParValue: true,
    parValue: null,
    currency: null,
    hasRightsOrRestrictions: false,
    series: []
  }

  private newShareSeries: ShareClassIF = {
    id: null,
    priority: null,
    type: 'Series',
    name: '',
    hasMaximumShares: true,
    maxNumberOfShares: null,
    hasParValue: true,
    parValue: null,
    currency: null,
    hasRightsOrRestrictions: false
  }

  private showShareStructureForm: boolean = false
  private addEditInProgress: boolean = false
  private currentShareStructure: ShareClassIF | null = null

  private activeIndex: number = -1
  private parentIndex: number = -1
  private nextId: number = -1

  // Lifecycle methods
  mounted (): void {
    this.setCreateShareStructureStepValidity(this.shareClasses.length > 0)
  }

  // Methods
  private initNewShareClass (): void {
    this.currentShareStructure = { ...this.newShareClass }
    this.currentShareStructure.priority =
    this.shareClasses.length === 0 ? 1 : this.shareClasses[this.shareClasses.length - 1].priority + 1
    this.activeIndex = -1
    this.parentIndex = -1
    this.nextId = this.shareClasses.length === 0 ? 1 : (this.shareClasses.reduce(
      (prev, current) => (prev.id > current.id) ? prev : current)).id + 1
    this.addEditInProgress = true
    this.showShareStructureForm = true
  }

  // Event Handlers
  private initShareClassForEdit (index: number): void {
    this.currentShareStructure = { ...this.shareClasses[index] }
    this.activeIndex = index
    this.parentIndex = -1
    this.addEditInProgress = true
    this.showShareStructureForm = true
  }

  private initNewShareSeries (shareClassIndex: number): void {
    this.activeIndex = -1
    this.parentIndex = shareClassIndex

    let newList: ShareClassIF[] = [...this.shareClasses]
    const parentShareClass = newList[shareClassIndex]
    const shareSeries = parentShareClass.series
    this.currentShareStructure = { ...this.newShareSeries }
    this.currentShareStructure.hasParValue = parentShareClass.hasParValue
    this.currentShareStructure.parValue = parentShareClass.parValue
    this.currentShareStructure.currency = parentShareClass.currency
    this.currentShareStructure.priority =
    shareSeries.length === 0 ? 1 : shareSeries[shareSeries.length - 1].priority + 1
    this.nextId = shareSeries.length === 0 ? 1 : (shareSeries.reduce(
      (prev, current) => (prev.id > current.id) ? prev : current)).id + 1
    this.addEditInProgress = true
    this.showShareStructureForm = true
  }

  private addEditShareClass (shareStructure: ShareClassIF): void {
    let newList: ShareClassIF[] = [...this.shareClasses]
    // New Share Structue.
    if (this.activeIndex === -1) {
      newList.push(shareStructure)
    } else {
      // Edit Share Structure.
      newList.splice(this.activeIndex, 1, shareStructure)
    }
    this.setShareClasses(newList)
    this.setCreateShareStructureStepValidity(this.shareClasses.length > 0)
    this.resetData()
  }

  private editSeries (index: number, seriesIndex: number): void {
    this.activeIndex = seriesIndex
    this.parentIndex = index
    let newList: ShareClassIF[] = [...this.shareClasses]
    this.currentShareStructure = { ...newList[this.parentIndex].series[this.activeIndex] }
    this.addEditInProgress = true
    this.showShareStructureForm = true
  }

  private removeSeries (index: number, seriesIndex: number): void {
    this.activeIndex = seriesIndex
    this.parentIndex = index
    let newList: ShareClassIF[] = [...this.shareClasses]
    const parentShareClass = newList[this.parentIndex]
    parentShareClass.series.splice(this.activeIndex, 1)
    this.setShareClasses(newList)
    this.setCreateShareStructureStepValidity(this.shareClasses.length > 0)
    this.resetData()
  }

  private addEditShareSeries (shareSeries: ShareClassIF): void {
    let newList: ShareClassIF[] = [...this.shareClasses]
    const parentShareClass = newList[this.parentIndex]
    let series = [...parentShareClass.series]
    // New Share Structue.
    if (this.activeIndex === -1) {
      series.push(shareSeries)
    } else {
      // Edit Share Structure.
      series.splice(this.activeIndex, 1, shareSeries)
    }
    parentShareClass.series = series
    this.setShareClasses(newList)
    this.resetData()
  }

  private removeShareClass (index: number): void {
    let newList: ShareClassIF[] = [...this.shareClasses]
    newList.splice(index, 1)
    this.setShareClasses(newList)
    this.setCreateShareStructureStepValidity(this.shareClasses.length > 0)
    this.resetData()
  }

  private resetData (): void {
    this.currentShareStructure = null
    this.activeIndex = -1
    this.addEditInProgress = false
    this.showShareStructureForm = false
    this.parentIndex = -1
    this.nextId = -1
  }

  private get showErrors (): boolean {
    return Boolean(this.$route.query.showErrors)
  }
}
</script>

<style lang="scss" scoped>
[class^="col"] {
  padding-top: 0;
  padding-bottom: 0;
}
.add-share-structure-container {
  margin-top: 1rem;
  margin-bottom:1rem;
}
ul {
  padding-top: 0.5rem;
  list-style: none;
  margin-left: 0;
  padding-left: 1rem
}
li {
  padding-top:0.25rem
}
p{
  padding-top: 0.5rem;
}
.btn-panel {
  padding: 2rem 0 2rem 0;
}
.chk-list-item-txt {
  margin-left: 0.5rem;
}
</style>
