/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { LegacyUsageDetail, MeterDetailsResponse } from '@azure/arm-consumption';
import { TagCollection } from '@cloud-carbon-footprint/common';
import { TeevityCommonBillingDataRow } from '@cloud-carbon-footprint/teevity';

/**
 * for noe we generate a LegacyUsageDetail
 */
export class TeevityAzureUsageDetailResult implements LegacyUsageDetail {
  public kind: 'legacy';
  public billingAccountId?: string;
  public billingAccountName?: string;
  public billingPeriodStartDate?: Date;
  public billingPeriodEndDate?: Date;
  public billingProfileId?: string;
  public billingProfileName?: string;
  public accountOwnerId?: string;
  public accountName?: string;
  public subscriptionId?: string;
  public subscriptionName?: string;
  public date?: Date;
  public product?: string;
  public partNumber?: string;
  public meterId?: string;
  public meterDetails?: MeterDetailsResponse;
  public quantity?: number;
  public effectivePrice?: number;
  public cost?: number;
  public unitPrice?: number;
  public billingCurrency?: string;
  public resourceLocation?: string;
  public consumedService?: string;
  public resourceId?: string;
  public resourceName?: string;
  public serviceInfo1?: string;
  public serviceInfo2?: string;
  public additionalInfo?: string;
  public invoiceSection?: string;
  public costCenter?: string;
  public resourceGroup?: string;
  public reservationId?: string;
  public reservationName?: string;
  public productOrderId?: string;
  public productOrderName?: string;
  public offerId?: string;
  public isAzureCreditEligible?: boolean;
  public term?: string;
  public publisherName?: string;
  public publisherType?: string;
  public planName?: string;
  public chargeType?: string;
  public frequency?: string;
  public payGPrice?: number;
  public pricingModel?: string;
  public id?: string;
  public name?: string;
  public type?: string;
  public etag?: string;
  public tags: TagCollection

  public constructor(teevityCommonBillingDataRow: TeevityCommonBillingDataRow) {
    this.date             = teevityCommonBillingDataRow.timestamp;
    this.subscriptionName = teevityCommonBillingDataRow.accountName;
    this.quantity         = teevityCommonBillingDataRow.usageAmount;
    this.resourceLocation = teevityCommonBillingDataRow.region;
    this.id               = teevityCommonBillingDataRow.accountId;
    this.subscriptionName = teevityCommonBillingDataRow.usageType;
    this.meterDetails     = new TeevityMeterDetailsResponse(teevityCommonBillingDataRow.usageType, teevityCommonBillingDataRow.usageUnit, teevityCommonBillingDataRow.serviceName)
    this.subscriptionName = teevityCommonBillingDataRow.serviceName;
    this.cost             = teevityCommonBillingDataRow.cost;
    this.tags             = teevityCommonBillingDataRow.tags;
  }
}

export class TeevityMeterDetailsResponse implements MeterDetailsResponse {
  public readonly meterName?: string;
  public readonly unitOfMeasure?: string;
  public readonly meterCategory?: string;

  constructor(meterNameAkaUsageType: string, unitOfMeasureAkaUsageUnit?: string, meterCategoryAkaServiceName?: string) {
    this.meterName = meterNameAkaUsageType;
    this.unitOfMeasure = unitOfMeasureAkaUsageUnit;
    this.meterCategory = meterCategoryAkaServiceName;
  }
}