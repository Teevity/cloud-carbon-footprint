import { MongoDbCacheManager } from '@cloud-carbon-footprint/app';
import { EstimationRequest } from '@cloud-carbon-footprint/app/src/CreateValidRequest';
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