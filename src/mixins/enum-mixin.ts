import { Component, Vue } from 'vue-property-decorator'
import {
  GetCorpFullDescription,
  GetCorpInfoObject,
  GetCorpNumberedDescription
} from '@bcrs-shared-components/corp-type-module'
import { CoopType } from '@/enums'

/**
 * Mixin that provides some useful enum utilities.
 */
@Component({})
export default class EnumMixin extends Vue {
  // from external module
  getCorpTypeInfo = GetCorpInfoObject
  getCorpTypeDescription = GetCorpFullDescription
  getCorpTypeNumberedDescription = GetCorpNumberedDescription

  /**
   * Converts the coop type to a description.
   * @param type the coop type
   * @returns the description
   */
  coopTypeToDescription (type: CoopType): string {
    switch (type) {
      case CoopType.COMMUNITY_SERVICE_COOPERATIVE: return 'Community Service Cooperative'
      case CoopType.ORDINARY_COOPERATIVE: return 'Ordinary Cooperative'
      case CoopType.HOUSING_COOPERATIVE: return 'Housing Cooperative'
    }
    return type // should never happen
  }
}
