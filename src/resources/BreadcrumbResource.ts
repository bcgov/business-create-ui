import { FilingTypes } from '@/enums'
import { GetCorpNumberedDescription } from '@bcrs-shared-components/corp-type-module'
import { BreadcrumbIF } from '@/interfaces'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'

setActivePinia(createPinia())
const store = useStore()

/** Returns legal name. */
function getLegalName (): string {
  const getFilingType: FilingTypes = store.getFilingType
  const getBusinessLegalName: string = store.getBusinessLegalName
  const getNameRequestApprovedName: string = store.getNameRequestApprovedName

  switch (getFilingType) {
    case FilingTypes.AMALGAMATION_APPLICATION: return getNameRequestApprovedName
    case FilingTypes.CONTINUATION_IN: return getNameRequestApprovedName
    case FilingTypes.DISSOLUTION: return getBusinessLegalName
    case FilingTypes.INCORPORATION_APPLICATION: return getNameRequestApprovedName
    case FilingTypes.REGISTRATION: return getNameRequestApprovedName
    case FilingTypes.RESTORATION: return getNameRequestApprovedName
  }
}

/** Returns numbered entity name. */
function getNumberedEntityName (): string {
  const getEntityType = store.getEntityType
  return GetCorpNumberedDescription(getEntityType)
}

/** Returns URL param string with Account ID if present, else empty string. */
function getParams (): string {
  const accountId = store.getAccountId
  return accountId ? `?accountid=${accountId}` : ''
}

export function getEntityDashboardBreadcrumb (): BreadcrumbIF {
  const getEntityIdentifier: string = store.getEntityIdentifier
  return {
    text: getLegalName() || getNumberedEntityName(),
    href: `${sessionStorage.getItem('DASHBOARD_URL')}${getEntityIdentifier}/${getParams()}`
  }
}

export function getRegistryDashboardBreadcrumb (): BreadcrumbIF {
  return {
    text: 'BC Registries Dashboard',
    href: `${sessionStorage.getItem('REGISTRY_HOME_URL')}dashboard/${getParams()}`
  }
}

export function getMyBusinessRegistryBreadcrumb (): BreadcrumbIF {
  return {
    text: 'My Business Registry',
    href: `${sessionStorage.getItem('BUSINESSES_URL')}business/${getParams()}`
  }
}

export function getSbcStaffDashboardBreadcrumb (): BreadcrumbIF {
  return {
    text: 'Staff Dashboard',
    href: `${sessionStorage.getItem('REGISTRY_HOME_URL')}dashboard/${getParams()}`
  }
}

export function getStaffDashboardBreadcrumb (): BreadcrumbIF {
  return {
    text: 'Staff Dashboard',
    href: `${sessionStorage.getItem('BUSINESSES_URL')}staff/${getParams()}`
  }
}
