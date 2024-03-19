import { TeevityCommonBillingDataRow } from '../model';

import { AccountDetailsOrIdList, CCFConfig, GroupBy, Logger } from '@cloud-carbon-footprint/common';
import { LoadTeevityReportByDateFromZipService } from './LoadTeevityReportByDateFromZipService';
import dayjs from 'dayjs';
export class TeevityCCFIntegrationService{

    private appLogger = new Logger('TeevityCCFIntegrationService')
    private _teevityCCFBillingExportDirectory: string;
    private _teevityUseBillingExport: boolean;

    public async loadUsage(ccfConfig: CCFConfig | any , start: Date, end: Date): Promise<TeevityCommonBillingDataRow[]>  {
        const currentStartDate = dayjs(start);
        const currentEndDate = dayjs(end);
        this.appLogger.info("Start loading data for CSP=[" + ccfConfig.NAME + "] startDate=[" + currentStartDate.format("YYYY-MM-DD") + "] EndDate=[" + currentEndDate.format("YYYY-MM-DD") + "]");
        let teevityReportDailyFileForSpecificDayAndCloudProvider = [];
        await LoadTeevityReportByDateFromZipService.getTeevityCarbonRowstRowByCSPAndDateInZip(ccfConfig.NAME ,currentStartDate, currentEndDate, this._teevityCCFBillingExportDirectory).then((teevityCarbonRow: TeevityCommonBillingDataRow[]) => {
            teevityReportDailyFileForSpecificDayAndCloudProvider = teevityCarbonRow;
        }).catch((error: Error) => {
            this.appLogger.warn(error.message);
            teevityReportDailyFileForSpecificDayAndCloudProvider = [];
        })
        this.appLogger.info("Done loading data for CSP=[" + ccfConfig.NAME + "] teevityData=[" + teevityReportDailyFileForSpecificDayAndCloudProvider.length + "] startDate=[" + currentStartDate.format("YYYY-MM-DD") + "] EndDate=[" + currentEndDate.format("YYYY-MM-DD") + "]");


        return teevityReportDailyFileForSpecificDayAndCloudProvider;
    }

    public get teevityCCFBillingExportDirectory(): string {
        return this._teevityCCFBillingExportDirectory;
    }

    public set teevityCCFBillingExportDirectory(teevityCCFBillingExportDirectory: string) {
        this._teevityCCFBillingExportDirectory = teevityCCFBillingExportDirectory;
    }

    public get useTheTeevityExportData(): boolean {
        return this._teevityUseBillingExport;
    }

    public set useTheTeevityExportData(useTheTeevityExportData: boolean) {
        this._teevityUseBillingExport = useTheTeevityExportData;
    }


    //
    //
    // Singleton
    //
    //

    private constructor() {
        try {
            // Load env properties
            this._teevityUseBillingExport = process.env.TEEVITY_USE_BILLING_EXPORT ? Boolean(process.env.TEEVITY_USE_BILLING_EXPORT) : false;

            if (this._teevityUseBillingExport == true) {
                let teevityCCFBillingExportDirectory: string | undefined = process.env.TEEVITY_CCF_BILLING_EXPORT_DIRECTORY;
                if (teevityCCFBillingExportDirectory == undefined) {
                    this._teevityCCFBillingExportDirectory = "";
                    new Error("TEEVITY_CCF_BILLING_EXPORT_DIRECTORY not defined")
                } else {
                    this._teevityCCFBillingExportDirectory = teevityCCFBillingExportDirectory;
                }
            }
            console.log("TeevityCCFIntegrationService init")
        } catch (error) {
            console.error("Cannot load the 'TEEVITY_CCF_BILLING_EXPORT_DIRECTORY'", error);
        }
    }

    private static teevityCCFIntegrationService: TeevityCCFIntegrationService = new TeevityCCFIntegrationService();

    public static getInstance(): TeevityCCFIntegrationService {
        return this.teevityCCFIntegrationService;
    }
}