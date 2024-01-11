import { execSync } from 'child_process';

class StartApp
{
  async start(use_ssl, env_variables_string)
  {
    try
    {
      const env_variables = this.get_env_variables(env_variables_string);
      const parcel_command = use_ssl ? 'yarn start-parcel-ssl' : 'yarn start-parcel';

      Object.assign(env_variables, process.env);

      execSync(`${parcel_command}`, { env: env_variables, stdio: 'inherit' });
    }
    catch (e)
    {
      console.error('Error:', e);
    }
  }

  get_env_variables(env_variables_string)
  {
    const env_variables = {};

    if (env_variables_string)
    {
      const env_variables_array = env_variables_string.split(',');

      for (const env_variable of env_variables_array)
      {
        const env_variable_array = env_variable.split('=');
        env_variables[env_variable_array[0]] = env_variable_array[1];
      }
    }

    return env_variables;
  }
}

const start_app = new StartApp();
start_app.start(process.argv[2] === 'true', process.argv[3]);
