export type AgentConfigType = {
  async: boolean;
  delay: number;
  packagePath: string;
  metadata: MetadataConfigType;
  webhook: WebhookConfigType | undefined;
};

export type MetadataConfigType = {
  host: string;
  timeout: number;
};

export type WebhookConfigType = {
  host: string;
  timeout: number;
};
