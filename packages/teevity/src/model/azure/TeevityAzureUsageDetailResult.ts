import { ModernUsageDetail, LegacyUsageDetail } from '@azure/arm-consumption';
import { TagCollection } from '@cloud-carbon-footprint/common';

export type UsageDetailResult = (LegacyUsageDetail | ModernUsageDetail) & {
    tags: TagCollection
  }

export type TeevityAzureUsageDetailResult = UsageDetailResult;





// We would like to create this class but it is not possible to extend UsageDetailResult


// export class TeevityAzureUsageDetailResult extends UsageDetailResult {    // We cannot import UsageDetailResult, it is not exported
//
//     private subscriptionName: string;
//
//     constructor(
//         // teevityCommonBillingDataRow: TeevityCommonBillingDataRow
//         ){
//         // this.subscriptionName = teevityCommonBillingDataRow.accountName
//     }
// }



// const getConsumptionDetails = (usageDetail: UsageDetailResult) => {
//     const consumptionDetails: Partial<BillingDataRow> = {
//       cloudProvider: 'AZURE',
//       accountName: usageDetail.subscriptionName,
//       timestamp: new Date(usageDetail.date),
//       usageAmount: usageDetail.quantity,
//       region: usageDetail.resourceLocation,
//     }
//
//     if (usageDetail.kind === 'modern') {
//       return {
//         ...consumptionDetails,
//         accountId: usageDetail.subscriptionGuid,
//         usageType: usageDetail.meterName,
//         usageUnit: usageDetail.unitOfMeasure,
//         serviceName: usageDetail.meterCategory,
//         cost: usageDetail.costInUSD,
//       }
//     } else {
//       return {
//         ...consumptionDetails,
//         accountId: usageDetail.id,
//         usageType: usageDetail.meterDetails.meterName,
//         usageUnit: usageDetail.meterDetails.unitOfMeasure,
//         serviceName: usageDetail.meterDetails.meterCategory,
//         cost: usageDetail.cost,
//       }
//     }
//   }
