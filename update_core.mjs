import { execSync } from 'child_process';
import * as fs from 'fs';

let package_json = JSON.parse(fs.readFileSync('./package.json'));
let core_version = package_json.dependencies['ohzi-core'];

execSync('cd core && git fetch origin main && git checkout v' + core_version);
