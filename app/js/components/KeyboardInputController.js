import { Input } from 'ohzi-core';

export default class KeyboardInputController
{
  constructor()
  {
    Input.keyboard.register_key('w');
    Input.keyboard.register_key('s');
    Input.keyboard.register_key('a');
    Input.keyboard.register_key('d');
    Input.keyboard.register_key('q');
    Input.keyboard.register_key('e');
    Input.keyboard.register_key('z');
    Input.keyboard.register_key('c');
    Input.keyboard.register_key('K');
    Input.keyboard.register_key('Enter');
    Input.keyboard.register_key('Shift');
    Input.keyboard.register_key(' ');
  }
}
