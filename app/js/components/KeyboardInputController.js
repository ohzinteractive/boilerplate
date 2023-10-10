import { MainInput } from './MainInput';

class KeyboardInputController
{
  constructor()
  {
    MainInput.keyboard.register_key('KeyW');
    MainInput.keyboard.register_key('ArrowUp');
    MainInput.keyboard.register_key('KeyS');
    MainInput.keyboard.register_key('ArrowDown');
    MainInput.keyboard.register_key('KeyA');
    MainInput.keyboard.register_key('ArrowLeft');
    MainInput.keyboard.register_key('KeyD');
    MainInput.keyboard.register_key('ArrowRight');
    MainInput.keyboard.register_key('KeyQ');
    MainInput.keyboard.register_key('KeyE');
    MainInput.keyboard.register_key('KeyZ');
    MainInput.keyboard.register_key('KeyC');
    MainInput.keyboard.register_key('KeyK');
    MainInput.keyboard.register_key('Enter');
    MainInput.keyboard.register_key('ShiftRight');
    MainInput.keyboard.register_key('Space');
  }
}

export { KeyboardInputController };
