import { ScmInterface } from './Scm.interface';
import { GitPackageType, PackageDataType } from '../types/PackageData.type';
import { exec } from '../lib/Process';

export class Git implements ScmInterface {
  private readonly requireVersion: number[];

  constructor() {
    this.requireVersion = '1.8.5'.split('.').map((value) => {
      return parseInt(value, 10);
    });
    this.checkVersion();
  }

  /**
   * required version: 1.8.5 higher
   */
  checkVersion() {
    const matches = exec(`git --version`).match(/git version ([.\d]+)/i);
    if (matches === null) throw new Error('check failed: git version');

    const requireVersion = this.requireVersion;
    const currentVersion: number[] = matches[1].split('.').map((value) => {
      return parseInt(value, 10);
    });

    let isHigher = false;
    requireVersion[requireVersion.length - 1]--;

    for (let i = 0; i < currentVersion.length; i++) {
      requireVersion[i] = requireVersion[i] ?? 0;
      if (currentVersion[i] > requireVersion[i]) {
        isHigher = true;
        break;
      }
    }

    if (!isHigher)
      throw new Error(
        `lower version (current: ${currentVersion.join(
          '.',
        )} / require: ${requireVersion.join('.')})`,
      );
  }

  async getRevision(packageData: PackageDataType): Promise<string> {
    const deployTarget: GitPackageType = Git.deployTarget(packageData);

    const hash = exec(`git -C ${deployTarget.path} rev-parse --verify HEAD`);

    if (hash.match(/^[a-z0-9]+$/) === null)
      throw new Error('not found local revision');

    return hash;
  }

  async setRevision(
    packageData: PackageDataType,
    revision: string,
  ): Promise<void> {
    const deployTarget: GitPackageType = Git.deployTarget(packageData);

    exec(`git -C ${deployTarget.path} stash`);
    exec(`git -C ${deployTarget.path} fetch origin ${deployTarget.branch}`);
    exec(`git -C ${deployTarget.path} reset --hard "${revision}"`);
  }

  private static deployTarget(packageData: PackageDataType): GitPackageType {
    return <GitPackageType>packageData.deployTarget;
  }
}

/*
  # git command list
  current branch:   `git -C ${path} branch --show-current`
  current revision: `git -C ${path} rev-parse --verify HEAD`
  stash(clean):     `git -C ${path} stash`
  has revision:     `git -C ${path} log ${revision} -n 1 --pretty=format:"%H"`
  set revision:     `git -C ${path} reset --hard "${revision}"`
  git pull:         `git -C ${path} pull`
  git fetch:        `git -C ${path} fetch origin ${branch}`
 */
