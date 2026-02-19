import type { AbstractScene, ActionSequencer } from "ohzi-core";

export class CommonSceneController 
{
    scene: AbstractScene

    start() {}
    before_enter() {}
    on_enter() {}
    before_exit() {}
    on_exit() {}
    update() {}
    update_enter_transition(global_view_data: { key: any }, transition_progress: number, action_sequencer: ActionSequencer) {}
    update_exit_transition(global_view_data: { key: any }, transition_progress: number, action_sequencer: ActionSequencer) {}
}