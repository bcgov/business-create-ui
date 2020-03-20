export interface ShareStructureIF {
    valid: boolean;
    shareClasses : ShareClassIF[];
}

export interface ShareClassIF {
    id: number| null;
    displayOrder: number; // To support move up and down functionality
    type: string; // Indicates whether class or series
    name: string;
    maxNumberOfShares: number | null;
    parValue: number | null;
    currency: string;
    hasNoMaximumShares: boolean;
    hasNoPar: boolean;
    hasRightsOrRestrictions: boolean;
    series: ShareClassIF[];
}
