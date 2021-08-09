import { PackageType } from '../types/Package.type';
import { readdir, readFile } from 'fs/promises';

export async function getPackages(packagePath: string): Promise<PackageType[]> {
  const files: Array<string> = await readdir(packagePath);
  const packages: PackageType[] = [];

  const promises = files.map(async (file) => {
    if (file.match(/\.json$/i) === null) return;

    const packageItem: PackageType = JSON.parse(
      await readFile(`${packagePath}/${file}`, {
        encoding: 'utf8',
      }),
    );

    packages.push(packageItem);
    console.info(`package: ${file}`);
  });

  await Promise.allSettled(promises).catch((e) => {
    console.log(e);
  });

  if (!packages) {
    throw new Error('packages is empty');
  }

  return packages;
}
