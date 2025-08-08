import fs from 'fs';
import replace from 'replace-in-file';

// import { home_data } from '../app/data/assets/home/home_data.js';
import { home_objects } from '../app/data/assets/home/home_objects.js';
// import { home_sounds } from '../app/data/assets/home/home_sounds.js';
import { home_textures } from '../app/data/assets/home/home_textures.js';

import { home_high_objects } from '../app/data/assets/home/high/home_high_objects.js';
import { home_high_sounds } from '../app/data/assets/home/high/home_high_sounds.js';
import { home_high_textures } from '../app/data/assets/home/high/home_high_textures.js';

class CalculateSizes
{
  async calculate()
  {
    this.replace_sizes(home_objects, './app/data/assets/home/home_objects.js');
    this.replace_sizes(home_textures, './app/data/assets/home/home_textures.js');
    // this.replace_sizes(home_sounds, './app/data/assets/home/home_sounds.js');
    // this.replace_sizes(home_data, './app/data/assets/home/home_data.js');

    this.replace_sizes(home_high_objects, './app/data/assets/home/high/home_high_objects.js');
    this.replace_sizes(home_high_sounds, './app/data/assets/home/high/home_high_sounds.js');
    this.replace_sizes(home_high_textures, './app/data/assets/home/high/home_high_textures.js');
  }

  async replace_sizes(files, parent_file_path)
  {
    this.remove_old_asset_size(parent_file_path);

    for (const file of files)
    {
      const file_path = `./public${file.url}`;

      // Stat the file to see if we have a file or dir
      const stat = await fs.promises.stat(file_path);

      this.update_asset_size(file.url, parent_file_path, stat.size);
    }

    // console.log('\x1b[33m', `${parent_file_path} Modified`);
  }

  remove_old_asset_size(parent_file_path)
  {
    const from = /^\s*size:\s*\d+,?\s*[\r\n]*/gm;
    const to = '    ';

    this.replace_in_file(from, to, parent_file_path);
  }

  update_asset_size(file_url, parent_file_path, size)
  {
    const from  = `url: '${file_url}'`;
    const to = `url: '${file_url}',
    size: ${size}`;

    this.replace_in_file(from, to, parent_file_path);
  }

  replace_in_file(from, to, parent_file_path)
  {
    // console.log(parent_file_path, from, to);
    const options = {
      files: parent_file_path,
      from: from,
      to: to
    };

    try
    {
      replace.sync(options);
    }
    catch (error)
    {
      console.error('Error occurred:', error);
    }
  }
}

const calculate_sizes = new CalculateSizes();

calculate_sizes.calculate()
;
