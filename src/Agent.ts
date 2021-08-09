import { AgentConfigType } from './types/AgentConfig.type';
import { PackageType } from './types/Package.type';
import { getPackages } from './lib/Packages';

export class Agent {
  private config: AgentConfigType;
  private packages: PackageType[] | undefined;

  constructor(config: AgentConfigType) {
    this.config = config;
  }

  public async main(): Promise<void> {
    console.log('deploy agent - initialize');

    this.packages = await getPackages(this.config.packagePath);

    if (this.config.async) {
      this.packages.map(async (packageItem: PackageType) => {
        while (Infinity) {
          await Agent.process(packageItem);
          await this.delay(this.config.delay);
        }
      });
    } else {
      while (Infinity) {
        for (let i = 0; i < this.packages.length; i++) {
          await Agent.process(this.packages[i]);
          await this.delay(this.config.delay);
        }
      }
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
