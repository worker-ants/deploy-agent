import { AgentConfigType } from '../types/AgentConfig.type';
import { PackageDataType } from '../types/PackageData.type';
import { getPackages } from '../lib/Packages';
import { DeployTypeEnum } from '../enums/DeployType.enum';
import { K8s } from '../providers/K8s';
import { Git } from '../providers/Git';
import { Metadata } from '../lib/Metadata';
import { MetadataType } from '../types/Metadata.type';
import { WebhookDataType } from '../types/WebhookData.type';
import { Webhook } from '../lib/Webhook';

export class Agent {
  private config: AgentConfigType;
  private waitingPackages: PackageDataType[];
  private metaClient: Metadata;
  private webhookClient: Webhook | undefined;

  constructor(config: AgentConfigType) {
    this.config = config;
    this.waitingPackages = [];
    this.metaClient = new Metadata(this.config.metadata);
    if (this.config.webhook !== undefined)
      this.webhookClient = new Webhook(this.config.webhook);
  }

  public async main(): Promise<void> {
    console.log('deploy agent - initialize');

    this.waitingPackages = await getPackages(this.config.packagePath);

    const concurrency = this.getConcurrency();
    const promises: Promise<void>[] = [];

    for (let i = 0; i < concurrency; i++) {
      promises.push(this.worker());
    }
    await Promise.allSettled(promises);
  }

  private getConcurrency(): number {
    const concurrency =
      this.config.concurrency !== null
        ? this.config.concurrency
        : this.waitingPackages.length;

    Math.min(concurrency, this.waitingPackages.length);
    return concurrency;
  }

  private async worker(): Promise<void> {
    while (Infinity) {
      if (this.waitingPackages.length < 1) break;

      const packageData = this.waitingPackages.shift();

      if (packageData === undefined) {
        if (this.waitingPackages.length > 0) {
          continue;
        } else {
          break;
        }
      }

      await this.process(packageData);
      this.waitingPackages.push(packageData);
      await this.delay(this.config.delay);
    }
  }

  private async process(packageData: PackageDataType): Promise<void> {
    let isAllowWebhook = false;
    let beforeRevision: string | undefined = undefined;
    let afterRevision: string | undefined = undefined;
    let metadata: MetadataType | undefined = undefined;

    try {
      const processLabel = `${packageData.label} (${packageData.project} - ${packageData.branch})`;

      console.log(`check: ${processLabel}`);
      metadata = await this.metaClient.getMetadata(packageData);
      Agent.checkValidMetadata(metadata, packageData);

      const provider = Agent.getProvider(packageData);
      beforeRevision = await provider.getRevision(packageData);

      if (beforeRevision === metadata.revision) return;

      console.info(`deploy start: ${processLabel}`);
      isAllowWebhook = true;

      // deploy process
      await provider.setRevision(packageData, metadata.revision);

      // check deploy result
      afterRevision = await provider.getRevision(packageData);
      const isSuccess = afterRevision === metadata.revision;
      const resultMessage = isSuccess
        ? `deploy success: ${processLabel} is ${beforeRevision} => ${afterRevision}`
        : `deploy failed: ${processLabel}`;

      if (isSuccess) {
        console.info(resultMessage);
      } else {
        console.error(resultMessage);
      }
    } catch (e) {
      console.error(e);
    } finally {
      if (isAllowWebhook) {
        const hookData = {
          serverName: this.config.serverName,
          package: packageData,
          metadata: metadata || null,
          revision: {
            before: beforeRevision || null,
            after: afterRevision || null,
          },
        } as WebhookDataType;

        await this.webhookClient?.setWebhook(hookData);
      }
    }
  }

  private static checkValidMetadata(
    metadata: MetadataType,
    packageData: PackageDataType,
  ) {
    if (metadata.project !== packageData.project)
      throw new Error(`project is not match`);
    if (metadata.branch !== packageData.branch)
      throw new Error(`project is not match`);
  }

  private async delay(delayTime: number): Promise<void> {
    return await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, delayTime);
    });
  }

  private static getProvider(packageItem: PackageDataType) {
    switch (packageItem.deployType) {
      case DeployTypeEnum.K8S:
        return new K8s();
      case DeployTypeEnum.GIT:
        return new Git();
      default:
        throw new Error(`undefined provider: ${packageItem.deployType}`);
    }
  }
}
