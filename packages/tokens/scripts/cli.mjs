#!/usr/bin/env node

import {
  buildContract,
  buildTheme,
  checkGeneratedArtifacts,
  validateAllThemes,
  validateTheme,
} from './lib.mjs';

const [command, argument] = process.argv.slice(2);

async function run() {
  switch (command) {
    case 'build-contract':
      await buildContract();
      process.stdout.write('Built Relay token contract artifacts.\n');
      return;
    case 'build-theme':
      if (!argument) {
        throw new Error('build-theme requires a theme name');
      }
      await buildTheme(argument);
      process.stdout.write(`Built ${argument} theme artifacts.\n`);
      return;
    case 'validate-theme':
      if (!argument) {
        throw new Error('validate-theme requires a theme name');
      }
      await validateTheme(argument);
      process.stdout.write(`Validated ${argument} theme contract.\n`);
      return;
    case 'validate':
      await validateAllThemes();
      process.stdout.write('Validated all Relay theme contracts.\n');
      return;
    case 'check':
      await validateAllThemes();
      await checkGeneratedArtifacts();
      process.stdout.write(
        'Token contracts and generated artifacts are clean.\n',
      );
      return;
    default:
      throw new Error(
        'Usage: relay-tokens <build-contract|build-theme|validate-theme|validate|check> [theme]',
      );
  }
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
