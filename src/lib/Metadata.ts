import { default as axios } from 'axios';
import { PackageDataType } from '../types/PackageData.type';
import { MetadataType } from '../types/Metadata.type';
import { MetadataConfigType } from '../types/AgentConfig.type';

export class Metadata {
  private readonly config: MetadataConfigType;

  constructor(config: MetadataConfigType) {
    this.config = config;
  }

  async getMetadata(packageData: PackageDataType): Promise<MetadataType> {
    const url = `${this.config.host}/${packageData.project}/${packageData.branch}`;
    const response = await axios.get(url, {
      responseType: 'json',
      timeout: this.config.timeout,
    });

    if (response.status !== 200) {
      console.error(url, response);
      throw new Error(`failed metadata: ${url} (status: ${response.status})`);
    }

    return response.data;
  }
}
