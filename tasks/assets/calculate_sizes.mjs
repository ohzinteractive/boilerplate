import fs from 'fs';
import path from 'path';

class CalculateSizes
{
  create_sizes_file()
  {
    this.logger = fs.createWriteStream('.env');
  }

  async read_folder(folder)
  {
    try
    {
      const files = await fs.promises.readdir(folder);

      for (const file of files)
      {
        // Get the full paths
        const file_path = path.join(folder, file);

        // Stat the file to see if we have a file or dir
        const stat = await fs.promises.stat(file_path);

        if (stat.isFile())
        {
          // Save size in .env file
          if (!file.startsWith('_') && !file.startsWith('.'))
          {
            this.logger.write(`${file}=${stat.size}\n`);
          }
        }
        else if (stat.isDirectory())
        {
          this.read_folder(file_path);
        }
      }
    }
    catch (e)
    {
      console.error('We\'ve thrown! Whoops!', e);
    }
  }
}

const calculate_sizes = new CalculateSizes();

calculate_sizes.create_sizes_file();
calculate_sizes.read_folder('./public');
