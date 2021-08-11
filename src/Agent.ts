import { AgentConfigType } from './types/AgentConfig.type';
import { PackageType } from './types/Package.type';
import { getPackages } from './lib/Packages';

export class Agent {
  private config: AgentConfigType;
  private waitingPackages: PackageType[];

  constructor(config: AgentConfigType) {
    this.config = config;
    this.waitingPackages = [];
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

      const packageItem = this.waitingPackages.shift();

      if (packageItem === undefined) {
        if (this.waitingPackages.length > 0) {
          continue;
        } else {
          break;
        }
      }

      await Agent.process(packageItem);
      this.waitingPackages.push(packageItem);
      await this.delay(this.config.delay);
    }
  }

  private static async process(packageItem: PackageType) {
    try {
      console.log(
        `check ${packageItem.label} (${packageItem.project} - ${packageItem.branch})`,
      );
      // @todo get local revisions
      // @todo get metadata
      // @todo diff revision
      // @todo deploy process
      // @todo get local revisions
      // @todo diff revision (check result)
      // @todo webhook
    } catch (e) {
      console.error(e);
    }
  }

  private async delay(delayTime: number): Promise<void> {
    return await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, delayTime);
    });
  }
}
