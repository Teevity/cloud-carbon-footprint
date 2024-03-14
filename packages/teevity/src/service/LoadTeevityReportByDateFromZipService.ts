import * as fs from 'fs';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc)
import csvParse from 'csv-parse';
import { TeevityCommonBillingDataRow } from '../model/TeevityCarbonRow';
import AdmZip from 'adm-zip';

export type Path = string
export type FileName = string

export class LoadTeevityReportByDateFromZipService {

    /**
     * 
     * @param csp 
     * @param date 
     * @param pathToAllZips 
     * @returns 
     */
    private static findCloudProvider(csp: string, date: Dayjs, pathToAllZips: Path): Path {
        // Define the subdirectory name based on the CSP
        const subDirectory = csp.toLowerCase(); // Convert to lowercase for comparison
    
        // Construct the full path of the subdirectory
        const fullPath = `${pathToAllZips}/${subDirectory}`;
    
        // Check if the subdirectory exists
        if (fs.existsSync(fullPath)) {
            return fullPath;
        } else {
            throw new Error("The subdirectory path does not exist");
        }
    }


    /**
     * 
     * @param csp ex: GCP, AWS, Azure
     * @param date YYYY-MM -> 2024-03
     * @returns Path
     */
    private static findZipByCSPAndDate(csp: string, dateStart: Dayjs, pathToAllZips: Path): Path {
        const zips = fs.readdirSync(pathToAllZips);
        const dateStartFormated = dateStart.format('YYYY-MM');

        const regex = new RegExp(`teevityCCFBillingExport-${csp.toLowerCase()}-.*-DAILY-${dateStartFormated}.zip`);
    
        let zipName = "NotDefined";

        for (const zip of zips) {
            if (regex.test(zip)) {
                zipName = zip;
            }
        }

        // Construct the full path of the subdirectory
        const fullPath = `${pathToAllZips}/${zipName}`;

        // Check if the subdirectory exists
        if (fs.existsSync(fullPath)) {
            return fullPath;
        } else {
            throw new Error("The zip path does not exist for dateStart=[" + dateStartFormated + "]" )
        }
    }



    /**
     * 
     * @param CSP ex: GCP, AWS, Azure
     * @param date YYYY-MM-DD -> 2024-03-18
     */
    private static findFileByCSPAndDateInZip(csp: string, dateStart: Dayjs, dateEnd: Dayjs, pathToTheZip: Path): AdmZip.IZipEntry {
        const zip = new AdmZip(pathToTheZip);
        const zipEntries = zip.getEntries();
        const dateStartFormated = dateStart.format('YYYY-MM-DD');
        const dateEndFormated = dateEnd.format('YYYY-MM-DD');

        const regex = new RegExp(`teevityCCFBillingExport-${csp.toLowerCase()}-.*-DAILY-${dateStartFormated}-${dateEndFormated}.csv`);

        for (const zipEntry of zipEntries) {
            if (!zipEntry.isDirectory && regex.test(zipEntry.entryName)) {
                return zipEntry;
            }
        }

        throw new Error("The csv path does not exist for dateStart=[" + dateStartFormated + "] and dateEnd=[" + dateEndFormated + "]" )
    }


    
    /**
     * 
     * @param csp ex: GCP, AWS, Azure
     * @param date YYYY-MM -> 2024-03
     * @returns Path
     */
    static getTeevityCarbonRowstRowByCSPAndDateInZip(csp: string, startDate: Dayjs, endDate: Dayjs, pathToAllZipsWithAllCloudProvider: Path): Promise<TeevityCommonBillingDataRow[]> {
        let teevityCarbonRowsAsZipEntry: AdmZip.IZipEntry ;
        try {
            const pathToAllZips = this.findCloudProvider(csp, startDate, pathToAllZipsWithAllCloudProvider)
            const teevityzipPath = this.findZipByCSPAndDate(csp, startDate, pathToAllZips);
            teevityCarbonRowsAsZipEntry = this.findFileByCSPAndDateInZip(csp, startDate, endDate, teevityzipPath);
        } catch (error) {
            return new Promise((resolve, reject) => {
                reject(error)
            })
        }

        return new Promise((resolve, reject) => {
            const csvContent = teevityCarbonRowsAsZipEntry.getData().toString('utf8');
            const csvData: TeevityCommonBillingDataRow[] = [];
    
            csvParse(csvContent, {
                columns: true,
                skip_empty_lines: true,
                trim: true,
                relax_column_count: true,
                cast(value, context) {
                    // Convertit les valeurs numériques si nécessaire
                    if (context.column === 'timestamp') {
                        return parseInt(value) ;
                    }

                    if (context.column === 'cost' || context.column === 'usageAmount') {
                        return parseFloat(value);
                    }
                    // Convertit les tags JSON en objet JavaScript
                    if (context.column === 'tags') {
                        return JSON.parse(value) ;
                    }
                    return value;
                }
            })
            .on('readable', function () {
                let record;
                while ((record = this.read())) {
                    const csvRow = new TeevityCommonBillingDataRow(
                        record.timestamp,
                        record.cloudProvider,
                        record.accountId,
                        record.accountName,
                        record.serviceName,
                        record.region,
                        record.usageType,
                        record.machineType,
                        record.seriesName,
                        record.cost,
                        record.usageAmount,
                        record.usageUnit,
                        record.tags
                    );
                    csvData.push(csvRow);
                }
            })
            .on('end', function () {
                resolve(csvData);
            })
            .on('error', function (err) {
                console.error(err)
                reject(err);
            });
        });
    }
}