/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import AWSCredentialsProvider from '../../application/AWSCredentialsProvider';
import { Credentials } from 'aws-sdk';
export class TeevityAWSCredentialsProvider extends AWSCredentialsProvider {
    constructor(
        public id: string,
        public name: string,
        private regions: string[],
    ) {
        super()
    }

    /**
     * We don't want to create a credential for aws
     * @param accountId 
     * @returns 
     */
    static override create(accountId: string): Credentials {
        return null as unknown as Credentials;
    }
}