import * as dotenv from 'dotenv';
import { AgentConfigType } from './types/AgentConfig.type';

dotenv.config({ encoding: 'utf8' });

export const agentConfig = {
  concurrency: parseInt(process.env.CONCURRENCY || '5', 10) || null,
  delay: parseInt(process.env.DELAY || '1000', 10) || 1000,
  packagePath: process.env.PACKAGE_PATH ?? './packages',
  metadata: {
    host: process.env.METADATA_HOST,
    timeout: parseInt(process.env.METADATA_TIMEOUT || '3000', 10) || 3000,
  },
  webhook: process.env.WEBHOOK_HOST
    ? {
        host: process.env.WEBHOOK_HOST,
        timeout: parseInt(process.env.WEBHOOK_TIMEOUT || '3000', 10) || 3000,
      }
    : undefined,
} as AgentConfigType;
