import { CorpTypeCd, FilingTypes } from '@/enums'
import { BreadcrumbIF } from '@/interfaces'
import { getVuexStore } from '@/store'
import { GetCorpNumberedDescription } from '@bcrs-shared-components/corp-type-module'

const store = getVuexStore()

/** Returns legal name. */
function getLegalName (): string {
  const getFilingType: FilingTypes = store.getters.getFilingType
  const getBusinessLegalName: string = store.getters.getBusinessLegalName
  const getApprovedName: string = store.getters.getApprovedName

  switch (getFilingType) {
    case FilingTypes.VOLUNTARY_DISSOLUTION: return getBusinessLegalName
    case FilingTypes.INCORPORATION_APPLICATION: return getApprovedName
    case FilingTypes.REGISTRATION: return getApprovedName
  }
}

/** Returns numbered entity name. */
function getNumberedEntityName (): string {
  const getEntityType = store.getters.getEntityType as CorpTypeCd
  return GetCorpNumberedDescription(getEntityType)
}

/** Returns URL param string with Account ID if present, else empty string. */
function getParams (): string {
  const accountId: number = JSON.parse(sessionStorage.getItem('CURRENT_ACCOUNT'))?.id
  return accountId ? `?accountid=${accountId}` : ''
}

export function getEntityDashboardBreadcrumb (): BreadcrumbIF {
  const getEntityIdentifier: string = store.getters.getEntityIdentifier
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
