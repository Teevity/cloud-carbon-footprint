import AWSCredentialsProvider from '@cloud-carbon-footprint/aws/src/application/AWSCredentialsProvider';
import { Credentials } from 'aws-sdk';
export class TeevityAWSCredentialsProvider extends AWSCredentialsProvider {
    /**
     * We don't want to create a credential for aws
     * @param accountId 
     * @returns 
     */
    static override create(accountId: string): Credentials {
        return null as unknown as Credentials;
    }
}