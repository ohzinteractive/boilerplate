export class Bifrost
{
  constructor()
  {
  }

  static run(app, method, args = [])
  {
    const method_string = method;

    const method_path = method_string.split('.');

    // If length 1 we are trying to call a method from mainapp
    let current_parent = method_path.length === 1 ? app : app[method_path[0]];
    let current_method = app[method_path[0]];

    // Go deep until find owner method
    for (let j = 1; j < method_path.length - 1; j++)
    {
      const parent = method_path[j];

      current_parent = current_method[parent];
    }

    // Go deep until find method to call
    for (let j = 1; j < method_path.length; j++)
    {
      const method = method_path[j];

      current_method = current_method[method];
    }

    const method_to_call = current_method.bind(current_parent);

    method_to_call(...args);
  }
}
