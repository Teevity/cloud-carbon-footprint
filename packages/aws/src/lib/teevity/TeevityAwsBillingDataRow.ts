/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import dayjs from "dayjs";
import Athena from "aws-sdk/clients/athena";
import { TeevityCommonBillingDataRow } from "@cloud-carbon-footprint/teevity";

export class TeevityAwsBillingDataRow {

    public timestamp: any;
    public cloudProvider: string;
    public accountId: string;
    public accountName: string;
    public serviceName: string;
    public region: string;
    public usageType: string;
    public machineType: string | null;
    public seriesName: string | null;
    public cost: number;
    public usageAmount: number;
    public usageUnit: string;
    public tags: Record<string, string>;

    constructor(     
        teevityCommonBillingDataRow: TeevityCommonBillingDataRow, 
    ) {
        this.timestamp = teevityCommonBillingDataRow.timestamp;
        this.cloudProvider = teevityCommonBillingDataRow.cloudProvider;
        this.accountId = teevityCommonBillingDataRow.accountId;
        this.accountName = teevityCommonBillingDataRow.accountName;
        this.serviceName = teevityCommonBillingDataRow.serviceName;
        this.region = teevityCommonBillingDataRow.region;
        this.usageType = teevityCommonBillingDataRow.usageType;
        this.machineType = teevityCommonBillingDataRow.machineType;
        this.seriesName = teevityCommonBillingDataRow.seriesName;
        this.cost = teevityCommonBillingDataRow.cost;
        this.usageAmount = teevityCommonBillingDataRow.usageAmount;
        this.usageUnit = teevityCommonBillingDataRow.usageUnit;
        this.timestamp = dayjs(teevityCommonBillingDataRow.timestamp).format("YYYY-MM-DD");
        this.tags = teevityCommonBillingDataRow.tags;
    }

    /**
     * Generate a fake Athena response that only CCF can read, as there is some Athena information missing in this response
     * @returns 
     */
    generateCcfAthenaRow(): Athena.Row {
        // Create the Athena result cf: CostAndUsageReports.ts:624
        const rowData =  {
            0: { VarCharValue: this.timestamp},   // timestamp
            1: { VarCharValue: this.accountId},   // accountName
            2: { VarCharValue: this.region},      // region
            3: { VarCharValue: this.serviceName}, // serviceName
            4: { VarCharValue: this.usageType},   // usageType
            5: { VarCharValue: this.usageUnit},   // usageUnit
            6: { VarCharValue: null},             // vCpus // TODO
            7: { VarCharValue: this.usageAmount}, // usageAmount
            8: { VarCharValue: this.cost}         // cost
            // after this ligne there are tags value
        }

        // Add tags
        Object.entries(this.tags).forEach(([tagKey, tagValue], index: number) => {
            rowData[9 + index] = {VarCharValue: tagValue}
        });

        return ({ Data: rowData } as unknown as Athena.Row);
    }
}