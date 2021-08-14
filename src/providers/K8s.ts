import { ScmInterface } from './Scm.interface';
import { K8sPackageType, PackageDataType } from '../types/PackageData.type';
import { exec } from '../lib/Process';

export class K8s implements ScmInterface {
  async getRevision(packageData: PackageDataType): Promise<string> {
    const deployTarget: K8sPackageType = K8s.deployTarget(packageData);
    const resourceInfoString = exec(
      `kubectl -n ${deployTarget.namespace} get ${deployTarget.resourceType} ${deployTarget.resourceName} -o json`,
    );
    const resourceInfo = JSON.parse(resourceInfoString);

    let hash: string | undefined = undefined;
    const containers = resourceInfo?.spec?.template?.spec?.containers || [];

    containers.forEach((item) => {
      if (
        deployTarget.container === item.name &&
        deployTarget.image === item.image.replace(/:.+$/, '')
      )
        hash = item.image.replace(/^.+:/, '');
    });

    if (hash === undefined) throw new Error('not found local revision');

    return hash;
  }

  async setRevision(
    packageData: PackageDataType,
    revision: string,
  ): Promise<void> {
    const deployTarget: K8sPackageType = K8s.deployTarget(packageData);
    exec(
      `kubectl set image --namespace=${deployTarget.namespace} ${deployTarget.resourceType}/${deployTarget.resourceName} ${deployTarget.container}=${deployTarget.image}:${revision}`,
    );
  }

  private static deployTarget(packageData: PackageDataType): K8sPackageType {
    return <K8sPackageType>packageData.deployTarget;
  }
}
