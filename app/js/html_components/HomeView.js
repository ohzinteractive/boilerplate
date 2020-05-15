import ApplicationView from './ApplicationView';

export default class HomeView extends ApplicationView
{
  start()
  {
    super.start('home', document.querySelector('.home'));
  }

  update()
  {
  }
}
