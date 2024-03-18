import { AccountDetailsOrIdList, GroupBy } from "@cloud-carbon-footprint/common";
import { CostAndUsageReports } from "@cloud-carbon-footprint/aws";
import { TeevityCCFIntegrationService } from "../../service";
import { TeevityAwsBillingDataRow } from "./TeevityAwsBillingDataRow";
import { TeevityCommonBillingDataRow } from "../TeevityCarbonRow";
import Athena from "aws-sdk/clients/athena";

export default class teevityAwsBillingExportTable extends CostAndUsageReports {

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
        // normally tagName is empty
        //   We get all tag name from teevityCommonBillingDataRows
        const uniqueTagNames= new Set<string>();
        teevityCommonBillingDataRows.forEach(teevityCommonBillingDataRow => {
          const tagNames = Object.keys(teevityCommonBillingDataRow.tags);
          tagNames.forEach(tagName => uniqueTagNames.add(tagName));
        });
        tagNames = Array.from(uniqueTagNames);

        return rows;
      }

      /**
       * 
       * @param teevityCommonBillingDataRows 
       */

}