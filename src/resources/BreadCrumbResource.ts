import { CorpTypeCd, FilingTypes } from '@/enums'
import { BreadcrumbIF } from '@/interfaces'
import { getVuexStore } from '@/store'
import { GetCorpNumberedDescription } from '@bcrs-shared-components/corp-type-module'

const getCorpTypeNumberedDescription = GetCorpNumberedDescription
const store = getVuexStore()

/** Returns legal name. */
function getLegalName (): string {
  const getFilingType = store.getters.getFilingType as FilingTypes
  const getBusinessLegalName = store.getters.getBusinessLegalName as string
  const getApprovedName = store.getters.getApprovedName as string

  switch (getFilingType) {
    case FilingTypes.VOLUNTARY_DISSOLUTION: return getBusinessLegalName
    case FilingTypes.INCORPORATION_APPLICATION: return getApprovedName
    case FilingTypes.REGISTRATION: return getApprovedName
  }
}

/** Returns numbered entity name. */
function getNumberedEntityName (): string {
  const getEntityType = store.getters.getEntityType as CorpTypeCd
  return `${getCorpTypeNumberedDescription(getEntityType)}`
}

/** Returns URL param string with Account ID if present, else empty string. */
function getParams (): string {
  const accountId = sessionStorage.getItem('ACCOUNT_ID')
  return accountId ? `?accountid=${accountId}` : ''
}

export function getEntityDashboardBreadcrumb (): BreadcrumbIF {
  const getEntityIdentifier = store.getters.getEntityIdentifier as string
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

export function getStaffMyRegistryBreadcrumb (): BreadcrumbIF {
  const accountId = sessionStorage.getItem('ACCOUNT_ID')
  return {
    text: 'My Business Registry',
    href: `${sessionStorage.getItem('BUSINESSES_URL')}account/${accountId}/business`
  }
}
