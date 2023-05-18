import { Input } from './Input';

class KeyboardInputController
{
  constructor()
  {
    Input.keyboard.register_key('KeyW');
    Input.keyboard.register_key('ArrowUp');
    Input.keyboard.register_key('KeyS');
    Input.keyboard.register_key('ArrowDown');
    Input.keyboard.register_key('KeyA');
    Input.keyboard.register_key('ArrowLeft');
    Input.keyboard.register_key('KeyD');
    Input.keyboard.register_key('ArrowRight');
    Input.keyboard.register_key('KeyQ');
    Input.keyboard.register_key('KeyE');
    Input.keyboard.register_key('KeyZ');
    Input.keyboard.register_key('KeyC');
    Input.keyboard.register_key('KeyK');
    Input.keyboard.register_key('Enter');
    Input.keyboard.register_key('ShiftRight');
    Input.keyboard.register_key('Space');
  }
}

export { KeyboardInputController };
