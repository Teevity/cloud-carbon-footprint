/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComputeEstimator, EmbodiedEmissionsEstimator, MemoryEstimator, NetworkingEstimator, StorageEstimator, UnknownEstimator } from "@cloud-carbon-footprint/core";
import ConsumptionManagementService from "../ConsumptionManagement";
import { ConsumptionManagementClient } from "@azure/arm-consumption";
import { TeevityAzureUsageDetailResult } from "./TeevityAzureUsageDetailResult";
import { TeevityCCFIntegrationService, TeevityCommonBillingDataRow } from '@cloud-carbon-footprint/teevity';
import { configLoader } from "@cloud-carbon-footprint/common";

export class TeevityConsumptionManagementService extends ConsumptionManagementService{

    constructor(
        computeEstimator: ComputeEstimator,
        ssdStorageEstimator: StorageEstimator,
        hddStorageEstimator: StorageEstimator,
        networkingEstimator: NetworkingEstimator,
        memoryEstimator: MemoryEstimator,
        unknownEstimator: UnknownEstimator,
        embodiedEmissionsEstimator: EmbodiedEmissionsEstimator,
        consumptionManagementClient?: ConsumptionManagementClient,
      ) {
        super (computeEstimator, ssdStorageEstimator, hddStorageEstimator, networkingEstimator, memoryEstimator, unknownEstimator, embodiedEmissionsEstimator, consumptionManagementClient)
      }

    protected override async getConsumptionUsageDetails(
        startDate: Date,
        endDate: Date,
      ): Promise<Array<TeevityAzureUsageDetailResult>> { 
        // create a fake ccfConfig for azure (the ccfConfi.name is the only parameter used)
        const gcpCcfConfig = { NAME: 'Azure' }
        const teevityCommonBillingDataRows: TeevityCommonBillingDataRow[] = await TeevityCCFIntegrationService.getInstance().loadUsage(gcpCcfConfig, startDate, endDate)
        const result: Array<TeevityAzureUsageDetailResult> = teevityCommonBillingDataRows.map((teevityCommonBillingDataRow: TeevityCommonBillingDataRow) => new TeevityAzureUsageDetailResult(teevityCommonBillingDataRow));

        // Update the tags list
        // normally configLoader().AZURE.RESOURCE_TAG_NAMES is empty or undefined
        // we cannot set azure tag from the data, the only way it is from the configLoader
        configLoader().AZURE.RESOURCE_TAG_NAMES = []
        //   We get all tag name from teevityCommonBillingDataRows
        const uniqueTagNames= new Set<string>();
        teevityCommonBillingDataRows.forEach(teevityCommonBillingDataRow => {
          const tagNames = Object.keys(teevityCommonBillingDataRow.tags);
          tagNames.forEach(tagName => uniqueTagNames.add(tagName));
        });
        // Set the list of azure tags
        configLoader().AZURE.RESOURCE_TAG_NAMES = Array.from(uniqueTagNames);

        return result;
      }    
}