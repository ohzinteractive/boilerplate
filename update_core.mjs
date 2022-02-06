import { execSync } from 'child_process';
import * as fs from 'fs';

const package_json = JSON.parse(fs.readFileSync('./package.json'));
const core_version = package_json.dependencies['ohzi-core'];

execSync('cd core && git fetch origin main && git checkout v' + core_version);
