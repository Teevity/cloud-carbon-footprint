import { BillingDataRow } from "@cloud-carbon-footprint/core";
import dayjs from "dayjs";

export class TeevityCommonBillingDataRow extends BillingDataRow  {
    constructor(
        timestamp: any,
        cloudProvider: string,
        accountId: string,
        accountName: string,
        serviceName: string,
        region: string,
        usageType: string,
        machineType: string | null,
        seriesName: string | null,
        cost: number,
        usageAmount: number,
        usageUnit: string,
        teevityTags: Record<string, string>) {
            // Convert tags values to csp specif structure, to make the downstream CCF code work
            super({
                timestamp: timestamp,
                accountId,
                accountName,
                region,
                serviceName,
                usageType,
                usageUnit,
                usageAmount,
                cost,
                tags: teevityTags
              })
    }
}