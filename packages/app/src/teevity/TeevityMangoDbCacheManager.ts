/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import MongoDbCacheManager from '../MongoDbCacheManager';
import { EstimationRequest } from '../CreateValidRequest';
import moment, { Moment } from "moment";

export class TeevityCacheManager extends MongoDbCacheManager {

    
    override async getMissingDates(
        request: EstimationRequest,
        grouping: string,
      ): Promise<Moment[]> {
        // Return juste the start/end date per request
        return [moment(request.startDate), moment(request.endDate)]
      }
}