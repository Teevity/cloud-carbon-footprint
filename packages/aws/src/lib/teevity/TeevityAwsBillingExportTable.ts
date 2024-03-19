/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AccountDetailsOrIdList, GroupBy } from "@cloud-carbon-footprint/common";
import { TeevityAwsBillingDataRow } from "./TeevityAwsBillingDataRow";
import CostAndUsageReports from "../CostAndUsageReports";
import { ServiceWrapper } from "../ServiceWrapper";
import { TeevityCommonBillingDataRow, TeevityCCFIntegrationService } from "@cloud-carbon-footprint/teevity";
import Athena from "aws-sdk/clients/athena";
import { ComputeEstimator, EmbodiedEmissionsEstimator, MemoryEstimator, NetworkingEstimator, StorageEstimator, UnknownEstimator } from "@cloud-carbon-footprint/core";

export class TeevityAwsBillingExportTable extends CostAndUsageReports {

  constructor(
    computeEstimator: ComputeEstimator,
    ssdStorageEstimator: StorageEstimator,
    hddStorageEstimator: StorageEstimator,
    networkingEstimator: NetworkingEstimator,
    memoryEstimator: MemoryEstimator,
    unknownEstimator: UnknownEstimator,
    embodiedEmissionsEstimator: EmbodiedEmissionsEstimator,
    serviceWrapper?: ServiceWrapper,
  ) {
    super(computeEstimator, ssdStorageEstimator, hddStorageEstimator, networkingEstimator, memoryEstimator, unknownEstimator, embodiedEmissionsEstimator, serviceWrapper)
  }

    protected override async getUsage(
      start: Date,
      end: Date,
      grouping: GroupBy,
      tagNames: string[],
      accounts: AccountDetailsOrIdList,
    ): Promise<Athena.Row[]> {
        // create a fake ccfConfig for azure (the ccfConfi.name is the only parameter used)
        const gcpCcfConfig = { NAME: 'AWS' }
        const teevityCommonBillingDataRows: TeevityCommonBillingDataRow[] = await TeevityCCFIntegrationService.getInstance().loadUsage(gcpCcfConfig, start, end)
        const rows = [];
        // The firt row is deleted by CCF
        rows.push('First athena row is dirty');
        teevityCommonBillingDataRows.forEach((teevityCommonBillingDataRow) => {
          rows.push( new TeevityAwsBillingDataRow(teevityCommonBillingDataRow).generateCcfAthenaRow());
        });
        
        // Update the tags list
        // normally tagName is empty, but we clear it
        tagNames.splice(0, tagNames.length);
        //   We get all tag name from teevityCommonBillingDataRows
        const uniqueTagNames= new Set<string>();
        teevityCommonBillingDataRows.forEach(teevityCommonBillingDataRow => {
          const tagNames = Object.keys(teevityCommonBillingDataRow.tags);
          tagNames.forEach(tagName => uniqueTagNames.add(tagName));
        });
        uniqueTagNames.forEach((tagName) => {
          tagNames.push(tagName)
        });

        return rows;
      }

      /**
       * 
       * @param teevityCommonBillingDataRows 
       */

}