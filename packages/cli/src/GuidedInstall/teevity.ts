/*
 * © 2021 Thoughtworks, Inc.
 */

import { EnvConfig, inputPrompt } from '../common'

export async function TeevitySetup(): Promise<EnvConfig> {
  const env: EnvConfig = {}
  env.TEEVITY_USE_BILLING_EXPORT = 'true'

  env.TEEVITY_CCF_BILLING_EXPORT_DIRECTORY = await inputPrompt(
    'Enter the absolute path to your directory where there are all teevity billing export (aws. azure, gcp):',
  )

  env.AWS_USE_BILLING_DATA = 'true'
  env.AZURE_USE_BILLING_DATA = 'true'
  env.GCP_USE_BILLING_DATA = 'true'
  env.GCP_USE_CARBON_FREE_ENERGY_PERCENTAGE = 'true'
  env.AZURE_INCLUDE_ESTIMATES = 'true'
  env.AZURE_USE_BILLING_DATA = 'true'

  return env
}
