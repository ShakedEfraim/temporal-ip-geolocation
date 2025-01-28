import * as workflow from '@temporalio/workflow';
import type * as activities from './activities';

const {getIP, getLocationInfo} = workflow.proxyActivities<typeof activities>({
  retry: {
    initialInterval: '1 second',
    maximumInterval: '1 minute',
    backoffCoefficient: 2,
    maximumAttempts: 5
  },
  startToCloseTimeout: '1 minute'
});

export async function getAddressFromIP(name: string): Promise<string>{
  try {
    const ip = await getIP();
    try {
      const location = await getLocationInfo(ip);
      return `Hello, ${name}. Your IP is ${ip} and your location is ${location}`;
    } catch (error){
      throw new workflow.ApplicationFailure("Failed to get location info");
    }
  }catch (error){
    throw new workflow.ApplicationFailure("Failed to get IP");
  }
}
