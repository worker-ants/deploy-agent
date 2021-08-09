import * as dotenv from 'dotenv';
import { AgentConfigType } from './types/AgentConfig.type';

dotenv.config({ encoding: 'utf8' });

export const agentConfig = {
  async: (process.env.ASYNC ?? 'true') !== 'false',
  delay: parseInt(process.env.DELAY || '3000', 10),
  packagePath: process.env.PACKAGE_PATH ?? './packages',
  metadata: {
    host: process.env.METADATA_HOST,
    timeout: parseInt(process.env.METADATA_TIMEOUT || '3000', 10),
  },
  webhook: process.env.WEBHOOK_HOST
    ? {
        host: process.env.WEBHOOK_HOST,
        timeout: parseInt(process.env.WEBHOOK_TIMEOUT || '3000', 10),
      }
    : undefined,
} as AgentConfigType;
