import { hostname } from 'os';
import {
  AgentConfigType,
  MetadataConfigType,
  WebhookConfigType,
} from '../types/AgentConfig.type';

export const agentConfig = {
  serverName: process.env.SERVER_NAME ?? hostname(),
  concurrency: parseInt(process.env.CONCURRENCY || '5', 10) || null,
  delay: parseInt(process.env.DELAY || '1000', 10) || 1000,
  packagePath: process.env.PACKAGE_PATH ?? './packages',
  metadata: {
    host: process.env.METADATA_HOST,
    timeout: parseInt(process.env.METADATA_TIMEOUT || '3000', 10) || 3000,
  } as MetadataConfigType,
  webhook: process.env.WEBHOOK_HOST
    ? ({
        host: process.env.WEBHOOK_HOST,
        timeout: parseInt(process.env.WEBHOOK_TIMEOUT || '3000', 10) || 3000,
      } as WebhookConfigType)
    : undefined,
} as AgentConfigType;
