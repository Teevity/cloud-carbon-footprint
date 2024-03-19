import dayjs from "dayjs";
import { TeevityCommonBillingDataRow } from "../TeevityCarbonRow";

export class TeevityGcpBillingDataRow {

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
    public tags: string

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
        this.timestamp = {value: dayjs(teevityCommonBillingDataRow.timestamp).format("YYYY-MM-DD")} // Create a fake bigQueryDate object;
        // Convert tags values to csp specif structure, to make the downstream CCF code work
        this.tags = TeevityGcpBillingDataRow.formatRecordToGcpFormat(teevityCommonBillingDataRow.tags)
    }

    /**
     * Convert a record to GCP format 
     * ex : {key1: value1, key2: value2} -> "key1: value1, key2: value2"
     * @param record 
     * @returns 
     */
        private static formatRecordToGcpFormat(record: Record<string, string>): string {
            let result = '';
            for (const [key, value] of Object.entries(record)) {
                result += `${key}: ${value}, `;
            }
            // Remove the extra comma and space at the end
            result = result.slice(0, -2);
            return result;
        }
}