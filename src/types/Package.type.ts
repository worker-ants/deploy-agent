import { DeployTypeEnum } from '../enums/DeployType.enum';
import { K8sResourceTypeEnum } from '../enums/K8sResourceType.enum';

export type PackageType = {
  label: string; // package name
  project: string; // project name
  branch: string; // project branch name
  deployType: DeployTypeEnum; // deploy type
  deployTarget: GitPackageType | K8sPackageType; // deploy target
};

export type GitPackageType = {
  path: string;
};

export type K8sPackageType = {
  namespace: string;
  resourceType: K8sResourceTypeEnum;
  resourceName: string;
  container: string;
};
