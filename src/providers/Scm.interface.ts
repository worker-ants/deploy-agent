import { PackageDataType } from '../types/PackageData.type';

export interface ScmInterface {
  /**
   * get local revision
   * @param packageData
   * @return string revision
   */
  getRevision(packageData: PackageDataType): Promise<string>;

  /**
   * set local revision
   * @param packageData
   * @param revision
   */
  setRevision(packageData: PackageDataType, revision: string): Promise<void>;
}
