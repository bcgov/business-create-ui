<template>
  <div>
    <section class="mt-10">
      <header id="share-structure-header">
        <h2>1. Incorporation Agreement and Articles</h2>
      </header>
      <p>
        Before submitting your incorporation application you must complete, sign, and date an Incorporation Agreement,
        and a set of Benefit Company Articles containing a benefit provision for the company you are about to
        incorporate.
      </p>

      <!-- Help Section -->
      <span class="help-btn" @click="helpToggle = !helpToggle">
        <v-icon color="blue darken-2" style="padding-right: 5px">mdi-help-circle-outline</v-icon>
        <span v-if="!helpToggle">Help with Incorporation Agreement and Articles</span>
        <span v-else>Hide Help</span>
      </span>
      <section v-show="helpToggle" class="share-structure-help">
        <section>
          <header>
            <h4>What is the Sample Incorporation Agreement and Benefit Company Articles?</h4>
          </header>
          <ul>
            <li>
              The Sample Incorporation Agreement and Benefit Company Articles is a template that you can use to create
              an incorporation agreement and articles for your company. It uses all the standard provisions suggested by
              legislation and also includes a place to specify the company’s benefit provision.
            </li>
            <li>
              If you would like to customize any other provisions in the Articles, you cannot use this sample. We
              recommend seeking professional assistance from a lawyer or accountant to help you prepare your Articles.
            </li>
          </ul>
        </section>
        <section>
          <header>
            <h4>What is a Benefit Provision?</h4>
          </header>
          <ul>
            <li>
              A Benefit Provision is a statement by the company of its public benefits and its commitments to promote
              those public benefits and to conduct business in a responsible and sustainable manner.
            </li>
            <li>
              A Benefit Company must include a benefit provision in its Articles.
            </li>
          </ul>
        </section>
        <section>
          <header>
            <h4>Can I use the Sample Incorporation Agreement and Benefit Company Articles?</h4>
            <h4>
              <span><v-icon color="green" class="article-stmt-icon">mdi-check</v-icon></span>
              <span>You can use the sample Articles if:</span>
            </h4>
          </header>
          <ul class="articles-statements">
            <li>
              <div>
                There are no special rights or restrictions attached to any class or series of shares in the
                corporation’s authorized share structure
              </div>
              <div>AND</div>
            </li>
            <li>
              You do not wish to change any of the standard provisions in the sample Articles.
            </li>
          </ul>
          <header>
            <h4>
              <span><v-icon color="red" class="article-stmt-icon">mdi-close</v-icon></span>
              <span>You cannot use the sample Articles if</span>
            </h4>
          </header>
          <ul class="articles-statements">
            <li>
              <div>
                There are special rights or restrictions attached to any class or series of shares in the corporation’s
                authorized share structure
              </div>
              <div>OR</div>
            </li>
            <li>
              You wish to change any of the standard provisions in the sample Articles.
            </li>
          </ul>
        </section>
        <section>
          <header>
            <h4>Retain the signed Incorporation Agreement and Benefit Company Articles</h4>
          </header>
          <ul>
            <li>
              The company is required to keep signed copies of the Incorporation Agreement and Articles in the company’s
              record book. For a complete list of records a company is required to keep please see section 42 of the
              Business Corporations Act.
            </li>
          </ul>
        </section>
        <u class="help-btn" @click="helpToggle = !helpToggle"><small>Hide Help</small></u>
      </section>
    </section>
    <section class="mt-10">
      <header id="share-structure-header">
        <h2>2. Sample Templates</h2>
      </header>
      <p>
        For your convenience, we have provided a sample Incorporation Agreement and a set of Sample Benefit Company
        Articles.
      </p>
      <div class="template-details">
        <span>
          <v-icon color="blue">mdi-file-pdf-outline</v-icon>
          <a href="/V6_DRAFT_Benefit_company_ corporation_agreement.pdf" download>
            Download the Sample Incorporation Agreement and Benefit Company Articles
          </a>
        </span>
      </div>
    </section>
    <section class="mt-10">
      <header id="share-structure-header">
        <h2>3. Confirm Incorporation Agreement and Article Completion</h2>
      </header>
      <div style="margin-left:1rem;">
        <v-radio-group v-model="agreementType" @change="changeAgreementType">
          <v-radio value="sample">
            <template slot="label">
              <span
                >The <b>Sample Incorporation Agreement and Benefit Company Articles</b> containing a benefit provision
                have been completed and a copy added to the company's record book.</span
              >
            </template>
          </v-radio>
          <v-radio value="custom" class="mt-2">
            <template slot="label">
              <span
                >A <b>custom Incorporation Agreement and custom Benefit Company Articles</b> containing a benefit
                provision have been completed and a copy added to the company's record book.</span
              >
            </template>
          </v-radio>
        </v-radio-group>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Vue } from 'vue-property-decorator'
import { Action, State } from 'vuex-class'

// Interfaces
import { ActionBindingIF, FormType, ShareClassIF } from '@/interfaces'

@Component
export default class IncorporationAgreement extends Vue {
  // State
  @State(state => state.stateModel.incorporationAgreementStep.incorporationAgreementType)
  readonly agreementTypeState: string | null

  // Actions
  @Action setIncorporationAgreementStepData!: ActionBindingIF
  @Action setIgnoreChanges!: ActionBindingIF

  private helpToggle: boolean = false
  private agreementType: string | null = null

  // Lifecycle methods
  private created (): void {
    // temporarily ignore data changes
    this.setIgnoreChanges(true)
    this.agreementType = this.agreementTypeState
    // watch data changes once page has loaded (in next tick)
    Vue.nextTick(() => {
      this.setIgnoreChanges(false)
    })
  }

  mounted (): void {
    this.setIncorporationAgreementStepData({
      'valid': !!this.agreementType,
      'incorporationAgreementType': this.agreementType
    })
  }

  private changeAgreementType (): void {
    this.setIncorporationAgreementStepData({
      'valid': !!this.agreementType,
      'incorporationAgreementType': this.agreementType
    })
  }

  private get helpLink (): string {
    return 'https://www2.gov.bc.ca/gov/content/employment-business/business/' +
    'managing-a-business/permits-licences/businesses-incorporated-companies'
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

[class^="col"] {
  padding-top: 0;
  padding-bottom: 0;
}

.add-share-structure-container {
  margin-top: 1rem;
  margin-bottom:1rem;
}

ul {
  list-style-type: disc;
}

.articles-statements{
  margin-left: 1.3rem;
}

li {
  padding-top:0.25rem
}

p{
  padding-top: 0.5rem;
}

.help-btn {
  cursor: pointer;
  color: #1976d2;
  vertical-align:middle;
}

.share-structure-help {
  margin: 2rem 0;
  border-top: 1px dashed $gray6;
  border-bottom: 1px dashed $gray6;
  padding: 1rem 0;

  #share-structure-sample {
    padding: 1rem 0;
  }

  h2, h4 {
    padding-top: 1rem;
  }

  u {
    display: flex;
    direction: rtl;
  }
}

.article-stmt-icon {
  margin-right: 0.2rem;
}

.template-details {
  display: flex;
  justify-content: center;
}
</style>
