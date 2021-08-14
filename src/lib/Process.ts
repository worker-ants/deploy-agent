import * as childProcess from 'child_process';

export function exec(command: string): string {
  try {
    const executed = childProcess
      .execSync(command, { encoding: 'utf8' })
      .replace(/\n$/, '');

    console.debug(command, executed);
    return executed;
  } catch (e) {
    console.error(command, e);
    throw e;
  }
}
