import { PackageDataType } from '../types/PackageData.type';
import { readdir, readFile } from 'fs/promises';

export async function getPackages(
  packagePath: string,
): Promise<PackageDataType[]> {
  const files: Array<string> = await readdir(packagePath);
  const packages: PackageDataType[] = [];

  const promises = files.map(async (file) => {
    try {
      if (file.match(/\.json$/i) === null) return;

      const packageItem: PackageDataType = JSON.parse(
        await readFile(`${packagePath}/${file}`, {
          encoding: 'utf8',
        }),
      );

      packages.push(packageItem);
      console.info(`package: ${file}`, packageItem);
    } catch (e) {
      console.error(e);
    }
  });

  await Promise.allSettled(promises).catch((e) => {
    console.log(e);
  });

  if (!packages) {
    throw new Error('packages is empty');
  }

  return packages;
}
