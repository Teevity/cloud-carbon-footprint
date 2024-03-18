import { Subscription } from '@azure/arm-resources-subscriptions'
import { AzureAccount } from '@cloud-carbon-footprint/azure';

export class TeevityAzureAccount extends AzureAccount {

    /**
     * we return only one fake subscription because TeevityAzureConsumptionManagement.getConsumptionUsageDetails 
     * will return data for all subscriptons (instead of just one in the CCF case)
     * @param subscriptionIds 
     * @returns 
     */
    protected async getSubscriptions(
        subscriptionIds: string[] = [],
    ): Promise<Subscription[]> {
        return [{subscriptionId: "000000-000000-000000"}];
    }

}