import { ApplicationView } from 'ohzi-core';
import { Sections, SectionsURLs } from '../Sections';

import TemplateSceneController from './TemplateSceneController';

export default class TemplateViewBase extends ApplicationView
{
  constructor()
  {
    super({
      name: Sections.TEMPLATE,
      url: SectionsURLs.TEMPLATE,
      container: document.querySelector('.template')
    });

    this.scene = new TemplateSceneController();
  }

  // This method is called one time at the beginning of the app execution.
  start()
  {
    this.scene.start();
  }

  // This method is called one time before the transition to this section is started.
  before_enter()
  {
    this.scene.before_enter();
  }

  // This method is called one time after the transition to this section is finished.
  on_enter()
  {
    super.on_enter();
    this.scene.on_enter();
  }

  // This method is called one time before the transition to the next section is started.
  before_exit()
  {
    super.before_exit();
    this.scene.before_exit();
  }

  // This method is called one time after this section is completely hidden.
  on_exit()
  {
    this.scene.on_exit();
  }

  // This method is called in every frame right after on_enter is called.
  update()
  {
    this.scene.update();
  }

  // This method is called in every frame when the site is transitioning to this section.
  update_enter_transition(global_view_data, transition_progress, action_sequencer)
  {
    this.scene.update_enter_transition(global_view_data, transition_progress, action_sequencer);

    this.set_opacity(global_view_data.template_opacity);
  }

  // This method is called in every frame when the site is transitioning from this section.
  update_exit_transition(global_view_data, transition_progress, action_sequencer)
  {
    this.scene.update_exit_transition(global_view_data, transition_progress, action_sequencer);

    this.set_opacity(global_view_data.template_opacity);
  }
}
