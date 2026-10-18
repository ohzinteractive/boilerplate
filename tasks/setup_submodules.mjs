import { execSync } from 'child_process';

class SetupSubmodules
{
  async build(env_variables_string)
  {
    try
    {
      execSync('yarn setup-core-submodule');
      execSync('yarn setup-components-submodule');
      execSync('yarn setup-pit-submodule');
      execSync('yarn setup-mcp-submodule');
    }
    catch (e)
    {
      console.error('Error:', e);
    }
  }

}

const build_app = new SetupSubmodules();
build_app.build();
