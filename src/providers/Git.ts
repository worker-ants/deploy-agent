import { ScmInterface } from './Scm.interface';
import { GitPackageType, PackageDataType } from '../types/PackageData.type';
import { exec } from '../lib/Process';

export class Git implements ScmInterface {
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
