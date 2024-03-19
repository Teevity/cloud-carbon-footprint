import { AccountDetailsOrIdList, GroupBy } from "@cloud-carbon-footprint/common";
import { BillingExportTable } from "@cloud-carbon-footprint/gcp";
import { RowMetadata } from '@google-cloud/bigquery'
import { TeevityCCFIntegrationService } from "../../service";
import { TeevityGcpBillingDataRow } from "./TeevityGcpBillingDataRow";
import { TeevityCommonBillingDataRow } from "../TeevityCarbonRow";

export class teevityGcpBillingExportTable extends BillingExportTable {
  constructor(
      computeEstimator, storageEstimator_SSD, StorageEstimator_HDD, NetworkingEstimator, MemoryEstimator, 
      UnknownEstimator, EmbodiedEmissionsEstimator, BigQuery?) {
    super(computeEstimator, storageEstimator_SSD, StorageEstimator_HDD, NetworkingEstimator, 
      MemoryEstimator, UnknownEstimator, EmbodiedEmissionsEstimator, BigQuery)
  }

  protected override async getUsage(
      start: Date,
      end: Date,
      grouping: GroupBy,
      tagNames: string[],
      projects: AccountDetailsOrIdList,
    ): Promise<RowMetadata[]> {
      // create a fake ccfConfig for azure (the ccfConfi.name is the only parameter used)
      const gcpCcfConfig = { NAME: 'GCP' }
      const teevityCommonBillingDataRows: TeevityCommonBillingDataRow[] = await TeevityCCFIntegrationService.getInstance().loadUsage(gcpCcfConfig, start, end)
      return teevityCommonBillingDataRows.map((teevityCommonBillingDataRow) => new TeevityGcpBillingDataRow(teevityCommonBillingDataRow));
    }

}