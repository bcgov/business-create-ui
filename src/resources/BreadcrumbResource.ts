import { FilingTypes } from '@/enums'
import { GetCorpNumberedDescription } from '@bcrs-shared-components/corp-type-module'
import { BreadcrumbIF } from '@/interfaces'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'

setActivePinia(createPinia())
const store = useStore()

/** Returns legal name. */
function getLegalName (): string {
  switch (store.getFilingType) {
    case FilingTypes.AMALGAMATION_APPLICATION: return store.getNameRequestApprovedName
    case FilingTypes.CONTINUATION_IN: return store.getNameRequestApprovedName
    case FilingTypes.DISSOLUTION: return store.getBusinessLegalName
    case FilingTypes.INCORPORATION_APPLICATION: return store.getNameRequestApprovedName
    case FilingTypes.REGISTRATION: return store.getNameRequestApprovedName
    case FilingTypes.RESTORATION: return store.getNameRequestApprovedName
  }
}

/** Returns numbered entity name. */
function getNumberedEntityName (): string {
  const getEntityType = store.getEntityType
  return GetCorpNumberedDescription(getEntityType)
}

/** Returns URL param string with Account ID if present, else empty string. */
function getParams (): string {
  const accountId = store.getCurrentAccount?.id
  return accountId ? `?accountid=${accountId}` : ''
}

/** Returns the breadcrumb to the Business Dashboard. */
export function getBusinessDashboardBreadcrumb (): BreadcrumbIF {
  const getEntityIdentifier: string = store.getEntityIdentifier
  return {
    text: getLegalName() || getNumberedEntityName(),
    href: `${sessionStorage.getItem('BUSINESS_DASH_URL')}${getEntityIdentifier}/${getParams()}`
  }
}

/** Returns the breadcrumb to the BC Registries Dashboard. */
export function getBcRegistriesDashboardBreadcrumb (): BreadcrumbIF {
  return {
    text: 'BC Registries Dashboard',
    href: `${sessionStorage.getItem('REGISTRY_HOME_URL')}dashboard/${getParams()}`
  }
}

/** Returns the breadcrumb to the My Business Registry page. */
export function getMyBusinessRegistryBreadcrumb (): BreadcrumbIF {
  return {
    text: 'My Business Registry',
    href: `${sessionStorage.getItem('BUSINESS_REGISTRY_URL')}account/${store.getCurrentAccount?.id}`
  }
}

/** Returns the breadcrumb to the SBC Staff dashboard. */
export function getSbcStaffDashboardBreadcrumb (): BreadcrumbIF {
  return {
    text: 'Staff Dashboard',
    href: `${sessionStorage.getItem('REGISTRY_HOME_URL')}dashboard/${getParams()}`
  }
}

/** Returns the breadcrumb to the Staff dashboard. */
export function getStaffDashboardBreadcrumb (): BreadcrumbIF {
  return {
    text: 'Staff Dashboard',
    href: `${sessionStorage.getItem('AUTH_WEB_URL')}staff/dashboard/active`
  }
}
