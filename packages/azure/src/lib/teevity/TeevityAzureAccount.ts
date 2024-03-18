/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Subscription } from '@azure/arm-resources-subscriptions'
import AzureAccount from '../../application/AzureAccount';
import { TeevityConsumptionManagementService } from './TeevityConsumptionManagementService';
import { ComputeEstimator, EmbodiedEmissionsEstimator, MemoryEstimator, NetworkingEstimator, StorageEstimator, UnknownEstimator } from '@cloud-carbon-footprint/core';
import { AZURE_CLOUD_CONSTANTS } from '../../domain';
import { GroupBy } from '@cloud-carbon-footprint/common';

export class TeevityAzureAccount extends AzureAccount {

    constructor() {
        super()
    }

    public override async initializeAccount(): Promise<void> {
        return null;
    }

    /**
     * we return only one fake subscription because TeevityAzureConsumptionManagement.getConsumptionUsageDetails 
     * will return data for all subscriptons (instead of just one in the CCF case)
     * @param subscriptionIds 
     * @returns 
     */
    protected override async getSubscriptions(
        subscriptionIds: string[] = [],
    ): Promise<Subscription[]> {
        return [{subscriptionId: "000000-000000-000000"} as Subscription];
    }

    /**
     * we don't want to create a ConsumptionManagementClient, so we set it to undefined
     * @param startDate 
     * @param endDate 
     * @param subscriptionId 
     * @param grouping 
     * @returns 
     */
    protected async getDataForSubscription(
        startDate: Date,
        endDate: Date,
        subscriptionId: string,
        grouping: GroupBy,
      ) {
        const consumptionManagementService = new TeevityConsumptionManagementService(
          new ComputeEstimator(),
          new StorageEstimator(AZURE_CLOUD_CONSTANTS.SSDCOEFFICIENT),
          new StorageEstimator(AZURE_CLOUD_CONSTANTS.HDDCOEFFICIENT),
          new NetworkingEstimator(AZURE_CLOUD_CONSTANTS.NETWORKING_COEFFICIENT),
          new MemoryEstimator(AZURE_CLOUD_CONSTANTS.MEMORY_COEFFICIENT),
          new UnknownEstimator(AZURE_CLOUD_CONSTANTS.ESTIMATE_UNKNOWN_USAGE_BY),
          new EmbodiedEmissionsEstimator(
            AZURE_CLOUD_CONSTANTS.SERVER_EXPECTED_LIFESPAN,
          ),
            undefined,
        )
        return await consumptionManagementService.getEstimates(
          startDate,
          endDate,
          grouping,
        )
      }

}