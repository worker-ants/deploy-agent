import { default as axios } from 'axios';
import { WebhookConfigType } from '../types/AgentConfig.type';
import { WebhookDataType } from '../types/WebhookData.type';

export class Webhook {
  private readonly config: WebhookConfigType;

  constructor(config: WebhookConfigType) {
    this.config = config;
  }

  async setWebhook(webhookDataType: WebhookDataType): Promise<void> {
    const url = this.config.host;
    const response = await axios.post(url, webhookDataType, {
      timeout: this.config.timeout,
    });

    if (response.status === 200) {
      console.debug(url, response);
    } else {
      console.error(url, response);
      throw new Error(`failed metadata: ${url} (status: ${response.status})`);
    }
  }
}
