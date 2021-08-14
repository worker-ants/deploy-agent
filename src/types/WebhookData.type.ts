import { PackageDataType } from './PackageData.type';
import { MetadataType } from './Metadata.type';

export type WebhookDataType = {
  serverName: string;
  package: PackageDataType;
  metadata: MetadataType | null;
  revision: {
    before: string | null;
    after: string | null;
  };
};
