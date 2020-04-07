export interface ShareStructureIF {
    valid: boolean;
    shareClasses : ShareClassIF[];
}

export interface ShareClassIF {
    id: number| null;
    type?: string; // Indicates whether class or series
    name: string;
    priority: number;
    maxNumberOfShares: number | null;
    hasMaximumShares?: boolean;
    parValue?: number | null;
    currency?: string;
    hasNoMaximumShares?: boolean;
    hasNoPar?: boolean;
    hasRightsOrRestrictions: boolean;
    series?: ShareClassIF[];
}
