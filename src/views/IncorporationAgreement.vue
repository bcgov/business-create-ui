<template>
  <div>
    <section class="mt-10">
      <header id="share-structure-header">
        <h2>1. Incorporation Agreement and Articles</h2>
      </header>
      <p>
        Before submitting your incorporation application you <b>must complete, sign, and date</b> an
        Incorporation Agreement, and a set of Benefit Company Articles containing a benefit provision
        for the company you are about to incorporate.
      </p>

      <!-- Help Section -->
      <span class="help-btn" @click="helpToggle = !helpToggle">
        <v-icon color="blue darken-2" style="padding-right: 5px">mdi-help-circle-outline</v-icon>
        <span v-if="!helpToggle">Help with Incorporation Agreement and Articles</span>
        <span v-else>Hide Help</span>
      </span>
      <section v-show="helpToggle" class="incorporation-agreement-help">
        <h4>What is the Sample Incorporation Agreement and Benefit Company Articles?</h4>
        <ul>
          <li>
            The Sample Incorporation Agreement and Benefit Company Articles is a template that you can use to create an
            incorporation agreement and articles for your company. It uses all the standard provisions suggested by
            legislation and also includes a place to specify the company’s benefit provision.
          </li>
          <li>
            If you would like to customize any other provisions in the Articles, you cannot use this sample. We
            recommend seeking professional assistance from a lawyer or accountant to help you prepare your Articles.
          </li>
        </ul>

        <h4>What is a Benefit Provision?</h4>
        <ul>
          <li>
            A Benefit Provision is a statement by the company of its public benefits and its commitments to promote
            those public benefits and to conduct business in a responsible and sustainable manner.
          </li>
          <li>
            A Benefit Company must include a benefit provision in its Articles.
          </li>
        </ul>
        <h4>Can I use the Sample Incorporation Agreement and Benefit Company Articles?</h4>
        <h4>
          <span><v-icon color="green" class="article-stmt-icon">mdi-check</v-icon></span>
          <span>You can use the sample Articles if:</span>
        </h4>
        <ul class="articles-statements">
          <li>
            <div>
              There are no special rights or restrictions attached to any class or series of shares in the corporation’s
              authorized share structure
            </div>
            <div>AND</div>
          </li>
          <li>
            You do not wish to change any of the standard provisions in the sample Articles.
          </li>
        </ul>
        <h4>
          <span><v-icon color="red" class="article-stmt-icon">mdi-close</v-icon></span>
          <span>You cannot use the sample Articles if</span>
        </h4>
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
        <div class="articles-statements-footer">
          In this case, you need to create a unique Incorporation Agreement and set of Articles for the company and
          outline these special rights or restrictions in the Articles. We recommend seeking professional assistance
          from a lawyer or accountant to help you prepare your Incorporation Agreement and Articles.
        </div>

        <h4>Retain the signed Incorporation Agreement and Benefit Company Articles</h4>
        <ul>
          <li>
            The company is required to keep signed copies of the Incorporation Agreement and Articles in the company’s
            record book. For a complete list of records a company is required to keep please see section 42 of the
            Business Corporations Act.
          </li>
        </ul>

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
        <v-card flat class="share-structure-check-panel">
          <div class="info-icon">
            <v-icon color="blue darken-2">mdi-information-outline</v-icon>
          </div>
          <div>
            <b>Share Structure Check</b>: The <b>sample articles CAN ONLY be used if</b> the company's
            share structure DOES NOT contain a class or series with special rights or restrictions.
            <span class="read-more-btn" @click="readMoreFlag = true">
              <span v-if="!readMoreFlag">Read more...</span>
            </span>
            <div  v-if="readMoreFlag">
              <p>
                If the corporation's share structure contains a class or series with special rights or
                restrictions, you need to create a unique set of Articles for the company and outline
                these special rights or restrictions in the Articles.
              </p>
              <div>
                We recommend seeking professional assistance from a lawyer or accountant to help you prepare
                your Incorporation Agreement and Articles.
                <span class="read-more-btn" @click="readMoreFlag = false">
                  <span>Read less...</span>
                </span>
              </div>
            </div>
          </div>
        </v-card>
      </div>
      <div class="download-link">
        <span>
          <v-icon color="blue">mdi-file-pdf-outline</v-icon>
          <a href="/files/benefit_company__corporation_agreement.pdf" download>
            Download the Sample Incorporation Agreement and Benefit Company Articles
          </a>
        </span>
      </div>
       <div class="download-link">
          <img src="@/assets/images/BCRegistries_Sample_IncoporationAgreement_x2.png" class="preview-image"/>
        </div>
        <div class="template-details">
          (check your share structure before using)
        </div>
    </section>
    <section class="mt-10">
      <header id="share-structure-header">
        <h2>3. Confirm Incorporation Agreement and Article Completion</h2>
      </header>
      <AgreementType/>
    </section>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Vue } from 'vue-property-decorator'
import { AgreementType } from '@/components/IncorporationAgreement'

@Component({
  components: {
    AgreementType
  }
})
export default class IncorporationAgreement extends Vue {
  private helpToggle: boolean = false
  private readMoreFlag: boolean = false

  private get documentURL (): string {
    return 'https://www2.gov.bc.ca/assets/gov/employment-business-and-economic-development/' +
    'business-management/permits-licences-and-registration/registries-forms/' +
    'benefit_company__corporation_agreement.pdf'
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

ul {
  list-style-type: disc;
}

li {
  padding-top:0.25rem
}

.articles-statements{
  margin-left: 1.3rem;
}

.articles-statements-footer {
  margin-left: 1.8rem;
  margin-top: 1.2rem
}

p{
  padding-top: 0.5rem;
}

.help-btn {
  cursor: pointer;
  color: #1976d2;
  vertical-align:middle;
}

.read-more-btn {
  cursor: pointer;
  color: #1976d2;
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

.download-link {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}

.share-structure-check-panel {
  width: 80%;
  display:flex;
  padding: 1rem;
  font-size: 0.875rem;
}

.preview-image {
  width: 215px;
  height: 267px;
}
</style>
