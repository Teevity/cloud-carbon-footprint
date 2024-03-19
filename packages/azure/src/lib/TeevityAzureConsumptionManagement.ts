/*
 * © 2024 Teevity
 */

import ConsumptionManagementService from './ConsumptionManagement'
import { UsageDetailResult } from './ConsumptionTypes'

export default class TeevityAzureConsumptionManagement extends ConsumptionManagementService {
  /**
   * Return data for one day for all subscriptions
   * @param startDate 
   * @param endDate 
   * @returns 
   */
  protected async getConsumptionUsageDetails(
    startDate: Date,
    endDate: Date,
  ): Promise<Array<UsageDetailResult>> {
    
    // TODO check that start/end date is just for one day

    return this.loadTeevityAzureDataForOneDay(startDate, endDate)
  }

  /**
   * Return data for one day for all subscriptions
   * @param startDate 
   * @param endDate 
   */
  private loadTeevityAzureDataForOneDay(startDate: Date, endDate: Date): Promise<Array<TeevityAzureUsageDetailResult>> {
    return null
  }
}
