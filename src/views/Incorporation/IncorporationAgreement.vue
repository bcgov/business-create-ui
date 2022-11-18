<template>
  <div id="incorporation-agreement">
    <!-- Intro section -->
    <section class="mt-10">
      <header>
        <h2>1. Incorporation Agreement and Articles</h2>
      </header>

      <!-- Benefit Company header-->
      <div class="pt-2 pb-3">
        <span>Before submitting your incorporation application you <b>must complete, sign, and date</b> an</span>
        <v-tooltip top max-width="20rem" content-class="top-tooltip" transition="fade-transition">
          <template v-slot:activator="{ on }">
            <span v-on="on" class="tool-tip"> Incorporation Agreement</span>
          </template>
          <span>
            A document that is signed and dated by the people who agree to form the corporation. They are the
            incorporators and the first shareholders of the corporation.
          </span>
        </v-tooltip>
        , and a set of
        <v-tooltip top max-width="20rem" content-class="top-tooltip" transition="fade-transition">
          <template v-slot:activator="{ on }">
            <span v-if="isTypeBcomp" v-on="on" class="tool-tip"> Benefit Company Articles</span>
            <span v-if="isTypeBcCompany" v-on="on" class="tool-tip"><br>BC LTD Articles.</span>
            <span v-if="isTypeBcUlcCompany" v-on="on" class="tool-tip"> Unlimited Liability Company Articles</span>
            <span v-if="isTypeBcCcc" v-on="on" class="tool-tip"> Community Contribution Company Articles</span>
          </template>
          <span v-if="isTypeBcomp">
            The Articles for a Benefit Company must state the benefits the company intends to provide to society, as
            well as outlining the rules and procedures for corporate matters such as holding meetings, issuing and
            transferring shares, and duties of directors and officers.
          </span>
          <span v-if="isTypeBcCompany">
            Articles should outline the rules and procedures for corporate matters such as holding meetings, issuing
            and transferring shares, and duties of directors and officers.
          </span>
          <span v-if="isTypeBcUlcCompany">
            The Articles for an Unlimited Liability Company must include the following statement: “The shareholders of
            this company are jointly and severally liable to satisfy the debts and liabilities of this company to the
            extent provided in section 51.3 of the Business Corporations Act.” Articles should also outline the rules
            and procedures for corporate matters such as holding meetings, issuing and transferring shares, and duties
            of directors and officers.
          </span>
          <span v-if="isTypeBcCcc">
            The Articles for a Community Contribution Company must include the following statements “This company is a
            community contribution company, and, as such, has purposes beneficial to society. This company is
            restricted, in accordance with Part 2.2 of the Business Corporations Act, in its ability to pay dividends
            and to distribute its assets on dissolution or otherwise.” Articles should also outline the rules and
            procedures for corporate matters such as holding meetings, issuing and transferring shares, and duties of
            directors and officers..
          </span>
        </v-tooltip>
        <template v-if="isTypeBcomp || isTypeBcUlcCompany || isTypeBcCcc">
          containing a
          <v-tooltip top max-width="20rem" content-class="top-tooltip" transition="fade-transition">
            <template v-slot:activator="{ on }">
              <span v-if="isTypeBcomp" v-on="on" class="tool-tip"> benefit provision</span>
              <span v-if="isTypeBcUlcCompany" v-on="on" class="tool-tip"> liability provision</span>
              <span v-if="isTypeBcCcc" v-on="on" class="tool-tip"> community provision</span>
            </template>
            <span v-if="isTypeBcomp">
              Clauses in the Articles which specify the public benefits to be promoted by the Benefit Company and the
              company's commitment to promote those benefits and to conduct business in a responsible and sustainable
              manner.
            </span>
            <span v-if="isTypeBcUlcCompany || isTypeBcCcc">
              A clause in the Articles which communicates the liability statement required by the Business Corporations
              Act 51.11.
            </span>
          </v-tooltip>
          for the company you are about to incorporate.
        </template>
      </div>

      <!-- Help Section -->
      <span class="help-btn" @click="helpToggle = !helpToggle">
        <v-icon color="primary" style="padding-right: 5px">mdi-help-circle-outline</v-icon>
        <span v-if="!helpToggle">Help with Incorporation Agreement and Articles</span>
        <span v-else>Hide Help</span>
      </span>

      <v-expand-transition>
        <section v-show="helpToggle" class="incorporation-agreement-help">
          <div
            v-for="(item, index) in getIncorporationAgreementResource.helpSection"
            :id="`agreement-help-${index}`"
            class="help-div"
            :key="index"
          >
            <h3>
              <v-icon v-if="item.icon" :color="item.iconColor" class="article-stmt-icon">{{item.icon}}</v-icon>
              {{item.header}}
            </h3>
            <ul v-for="(text, index) in item.helpText"
                :id="`agreement-help-text-${index}`"
                class="help-div"
                :key="index">
              <li>{{text}}</li>
            </ul>
            <ul v-for="(text, index) in item.statements"
                :id="`agreement-statements-${index}`"
                class="articles-statements"
                :key="index">
              <li>{{text}}</li>
            </ul>
          </div>

          <template v-if="!isTypeBcCcc">
            <div class="help-div">
              <div class="articles-statements-footer">
                In this case, you need to create a unique Incorporation Agreement and set of
                Articles for the company and outline these special rights or restrictions in the
                Articles. We recommend seeking professional assistance from a lawyer or accountant
                to help you prepare your Incorporation Agreement and Articles.
              </div>
            </div>
            <div class="help-div">
              <h3>Retain the signed Incorporation Agreement and {{ entityDescription }} Articles</h3>
              <ul>
                <li>
                  The company is required to keep signed copies of the Incorporation Agreement and
                  Articles in the company’s record book. For a complete list of records a company
                  is required to keep please see <a :href="section42Url" target="_blank">section 42</a>
                  of the Business Corporations Act.
                </li>
              </ul>
            </div>
          </template>
          <u class="help-btn" @click="helpToggle = !helpToggle"><small>Hide Help</small></u>
        </section>
      </v-expand-transition>
    </section>

    <!-- Sample Templates -->
    <template>
      <section v-if="isTypeBcomp || isTypeBcCompany || isTypeBcCcc" class="mt-10">
        <header>
          <h2>2. Sample Templates</h2>
        </header>

        <p>
          For your convenience, we have provided a sample Incorporation Agreement and a set of sample
          {{ entityDescription }} Articles.
        </p>
        <v-card flat class="share-structure-check-panel py-8 px-6">
          <div class="share-structure-check-header">
            <v-icon color="black">mdi-information-outline</v-icon>
            <span> Share Structure Check:</span>
          </div>

          <div class="share-structure-check-text">
            The sample articles CAN ONLY be used if the company's share structure DOES NOT contain a class or series
            with special rights or restrictions.
            <span class="read-more-btn" @click="readMoreFlag = true">
              <span v-if="!readMoreFlag">Read more...</span>
            </span>
            <div v-if="readMoreFlag">
              <div class="read-more-line">
                If the corporation's share structure contains a class or series with special rights or restrictions,
                you need to create a unique set of Articles for the company and outline these special rights or
                restrictions in the Articles.
              </div>
              <div class="read-more-line">
                We recommend seeking professional assistance from a lawyer or accountant to help you prepare your
                Incorporation Agreement and Articles.
                <span class="read-more-btn" @click="readMoreFlag = false">
                <span>Read less...</span>
              </span>
              </div>
            </div>
          </div>

          <div class="d-flex flex-column flex-sm-row justify-center align-center mt-6">
            <img src="@/assets/images/BCRegistries_Sample_IncoporationAgreement_x2.png" class="preview-image" />
            <div class="px-8" />
            <div class="download-link-container py-5">
              <v-icon color="primary" class="mt-n1">mdi-file-pdf-outline</v-icon>
              <a :href="documentURL" download class="ml-1">
                Download the sample Incorporation Agreement and Company Articles
              </a>
            </div>
          </div>
        </v-card>
      </section>

      <section class="mt-10">
        <header id="confirm-agreement">
          <h2 v-if="isTypeBcomp || isTypeBcCompany || isTypeBcCcc">3. Confirm Incorporation Agreement and Article
            Completion</h2>
          <h2 v-if="isTypeBcUlcCompany">2. Confirm Incorporation Agreement and Article Completion</h2>
        </header>

        <v-card flat class="mt-6">
          <AgreementType :showErrorSummary="!getIncorporationAgreementStep.valid" />
        </v-card>
      </section>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import AgreementType from '@/components/common/AgreementType.vue'
import { IncorporationAgreementIF } from '@/interfaces'
import { CorpTypeCd, RouteNames } from '@/enums'
import { CommonMixin } from '@/mixins'
import { GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'

@Component({
  components: {
    AgreementType
  }
})
export default class IncorporationAgreement extends Mixins(CommonMixin) {
  @Getter isTypeBcomp!: boolean
  @Getter isTypeBcCcc!: boolean
  @Getter isTypeBcCompany!: boolean
  @Getter isTypeBcUlcCompany!: boolean
  @Getter getEntityType!: CorpTypeCd
  @Getter getIncorporationAgreementStep!: IncorporationAgreementIF
  @Getter getIncorporationAgreementResource!: any
  @Getter getSampleArticle!: string
  @Getter getShowErrors!: boolean

  // Local properties
  protected helpToggle = false
  protected readMoreFlag = false

  readonly section42Url = 'https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/' +
    '02057_02#section42'

  /** The entity description. */
  get entityDescription (): string {
    return GetCorpFullDescription(this.getEntityType)
  }

  get documentURL (): string {
    return sessionStorage.getItem('BASE_URL') +
    `files/${this.getSampleArticle}`
  }

  @Watch('$route')
  private async scrollToInvalidComponent (): Promise<void> {
    if (this.getShowErrors && this.$route.name === RouteNames.INCORPORATION_AGREEMENT) {
      // scroll to invalid components
      await this.$nextTick()
      await this.validateAndScroll(
        {
          isAgreementValid: this.getIncorporationAgreementStep.valid
        },
        [
          'confirm-agreement'
        ]
      )
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

ul {
  list-style-type: disc;
}

li {
  padding-top: 0.25rem;
}

.articles-statements{
  margin-left: 1.3rem;
}

.articles-statements-footer {
  margin-left: 1.8rem;
  margin-top: 1.2rem;
}

p{
  padding-top: 0.5rem;
}

a {
  text-decoration: none;
  color: $app-blue;
}

.help-btn {
  cursor: pointer;
  color: $app-blue;
  vertical-align: middle;
}

.read-more-btn {
  cursor: pointer;
  color: $app-blue;
}

.incorporation-agreement-help {
  margin: 2rem 0;
  border-top: 1px dashed $gray6;
  border-bottom: 1px dashed $gray6;
  padding: 1rem 0;

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
  margin-top: 0.5rem;
}

.download-link-container {
  border-top: solid 1px $gray3;
  border-bottom: solid 1px $gray3;
}

.share-structure-check-panel {
  vertical-align: middle;
}

.share-structure-check-text {
  font-size: $px-14;
  padding-left: 4px;
}

.share-structure-check-header {
  font-size: $px-14;
  font-weight: bold;
  padding-bottom: 0.5rem;
}

.preview-image {
  width: 200px;
  height: 259px;
}

.tool-tip {
  border-bottom: 1px dashed #999;
  text-decoration: none;
}

.read-more-line {
  padding-top: 0.5rem;
}

.help-div {
  padding-top: 1rem;
}
</style>
