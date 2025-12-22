# Creating Modals - OHZI Boilerplate Guide

Modals are overlay UI components used to display content on top of your application. They're perfect for confirmations, forms, galleries, notifications, and other focused interactions.

## What is a Modal?

A **Modal** in the OHZI Boilerplate:
- Overlays the main content
- Can have multiple states (different modal screens)
- Integrates with UI collision layer for click handling
- Supports enter/exit animations
- Can be nested (showing one modal from another)
- Lazy loads images and videos

## Modal Architecture

The modal system consists of:
- **ModalComponent**: Singleton that manages all modal states
- **ModalState**: Individual modal screens/states
- **Pug Templates**: HTML structure for each modal state
- **SCSS Styles**: Styling for modal appearance and animations

## Creating a Modal Automatically

Use the provided script to scaffold a new modal state:

```bash
yarn create-modal my_modal
```

This creates:

```
app/js/view_components/modal/states/
└── MyModalModalState.js

app/views/components/modal/states/
└── my_modal.pug

app/css/components/modal/my_modal/
└── _my_modal.scss
```

And automatically updates:
- `app/js/view_components/modal/ModalComponent.js` - Adds import and state registration
- `app/views/components/modal/modal.pug` - Includes the new template
- `app/css/components/modal/_modal.scss` - Imports the new styles

## Modal State Structure

### JavaScript State Class

**Location**: `app/js/view_components/modal/states/[ModalName]ModalState.js`

```javascript
import { ModalState } from 'ohzi-components';

class MyModalModalState extends ModalState
{
  constructor(name)
  {
    super(name);
    
    // Reference to DOM elements
    this.container = document.querySelector('.modal__container.my-modal');
  }

  on_enter(component)
  {
    super.on_enter(component);
    
    // Called when modal state becomes active
    // Initialize interactions, start animations
    this.setup_buttons();
  }

  on_exit(component)
  {
    super.on_exit(component);
    
    // Called when modal state is hidden
    // Cleanup listeners, stop animations
    this.cleanup_buttons();
  }

  update(component)
  {
    super.update(component);
    
    // Called every frame while modal is active
    // Update animations, check conditions
  }

  setup_buttons()
  {
    const confirm_btn = this.container.querySelector('.confirm-button');
    if (confirm_btn)
    {
      this.confirm_handler = () => this.on_confirm();
      confirm_btn.addEventListener('click', this.confirm_handler);
    }
  }

  cleanup_buttons()
  {
    const confirm_btn = this.container.querySelector('.confirm-button');
    if (confirm_btn && this.confirm_handler)
    {
      confirm_btn.removeEventListener('click', this.confirm_handler);
    }
  }

  on_confirm()
  {
    // Handle confirm action
    console.log('Modal confirmed!');
  }
}

export { MyModalModalState };
```

### Pug Template

**Location**: `app/views/components/modal/states/[modal_name].pug`

```pug
+modal({ classes: 'my-modal' })

  +modal_header
    .modal__title My Modal Title

  +modal_body
    .modal__text This is the modal content
    p You can add any HTML content here

  +modal_footer
    .button.button--secondary(onclick="ModalComponent.hide()") Cancel
    .button.button--primary.confirm-button Confirm
```

#### Modal Mixin Options

The `+modal()` mixin accepts these options:

```pug
+modal({
  classes: 'custom-class',           // Additional CSS classes
  header_classes: 'custom-header',   // Header specific classes
  content_classes: 'custom-content', // Content wrapper classes
  body_classes: 'custom-body',       // Body specific classes
  footer_classes: 'custom-footer',   // Footer specific classes
  show_close_icon: true,             // Show X button in header
  close_action: 'ModalComponent.hide()' // Custom close action
})
```

### SCSS Styling

**Location**: `app/css/components/modal/[modal_name]/_[modal_name].scss`

```scss
.my-modal {
  // Target the modal container
  
  .modal__content {
    max-width: 600px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  }

  .modal__header {
    padding: 2rem;
    border-bottom: 1px solid #eee;
  }

  .modal__title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
  }

  .modal__body {
    padding: 2rem;
  }

  .modal__footer {
    padding: 1.5rem 2rem;
    border-top: 1px solid #eee;
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
  }

  .button {
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;

    &--primary {
      background: #007bff;
      color: white;

      &:hover {
        background: #0056b3;
      }
    }

    &--secondary {
      background: #6c757d;
      color: white;

      &:hover {
        background: #545b62;
      }
    }
  }
}
```

## Using Modals in Your Application

### 1. Initialize the Modal Component

In your `MainApplication.js`:

```javascript
import { ModalComponent } from './view_components/modal/ModalComponent';
import { UICollisionLayer } from 'ohzi-components';
import { Input } from './components/Input';
import { Time } from 'ohzi-core';

init()
{
  this.ui_collision_layer = UICollisionLayer;
  this.ui_collision_layer.init(Input, Time);

  this.modal_component = ModalComponent;
  this.modal_component.init(UICollisionLayer, Time);
}

on_enter()
{
  this.modal_component.start();
}

update()
{
  this.modal_component.update();
}
```

### 2. Show a Modal

```javascript
// Show a specific modal state
ModalComponent.show_state('my_modal');

// Show with collision detection enabled (default)
ModalComponent.show_state('my_modal', true);

// Show without collision detection
ModalComponent.show_state('my_modal', false);
```

### 3. Hide a Modal

```javascript
// Hide current modal
ModalComponent.hide();
```

### 4. Access from HTML

You can trigger modals directly from HTML using onclick:

```pug
// Show modal
button(onclick="app.modal_component.show_state('my_modal')") Open Modal

// Hide modal
button(onclick="app.modal_component.hide()") Close Modal
```

## Modal Lifecycle

```
show_state('modal_name') 
    ↓
on_enter() [ModalComponent]
    ↓
set_state(new_state)
    ↓
on_enter(component) [ModalState]
    ↓
update(component) [every frame]
    ↓
hide()
    ↓
on_exit(component) [ModalState]
    ↓
on_exit() [ModalComponent]
```

## Advanced Features

### Nested Modals

You can show one modal from another:

```javascript
class FirstModalState extends ModalState
{
  on_enter(component)
  {
    super.on_enter(component);
    
    const next_button = this.container.querySelector('.next-button');
    next_button.addEventListener('click', () => {
      // This will hide current modal and show the next one
      ModalComponent.show_state('second_modal');
    });
  }
}
```

### Lazy Loading Media

The modal system automatically lazy loads images and videos when shown:

```pug
+modal_body
  // Use data-src instead of src
  img(data-src="/images/photo.jpg", alt="Photo")
  video(data-src="/videos/demo.mp4", controls)
```

Images and videos are loaded when `show_state()` is called.

### UI Collision Layer Integration

Modals integrate with the UICollisionLayer to handle clicks:

```javascript
// Show modal with collision detection
ModalComponent.show_state('my_modal', true);
// Clicks outside the modal will be blocked

// Show without collision detection  
ModalComponent.show_state('my_modal', false);
// Clicks pass through the modal overlay
```

## Best Practices

1. **Clean Up Event Listeners**: Always remove event listeners in `on_exit()`
2. **Naming Convention**: Use snake_case for modal names (e.g., `confirm_dialog`, `user_profile`)
3. **Collision Detection**: Enable collision for important modals to prevent accidental dismissal
4. **Lazy Loading**: Use `data-src` for images/videos to improve performance
5. **Accessibility**: Include proper ARIA labels and keyboard navigation
6. **State Management**: Keep modal state logic in the ModalState class, not in the template
7. **Animations**: Add CSS transitions for smooth enter/exit animations

## Example: Confirmation Modal

Here's a complete example of a confirmation modal:

### JavaScript State

```javascript
import { ModalState } from 'ohzi-components';

class ConfirmDialogModalState extends ModalState
{
  constructor(name)
  {
    super(name);
    this.on_confirm_callback = null;
  }

  on_enter(component)
  {
    super.on_enter(component);

    const confirm_btn = this.container.querySelector('.confirm-btn');
    const cancel_btn = this.container.querySelector('.cancel-btn');

    this.confirm_handler = () => this.handle_confirm();
    this.cancel_handler = () => this.handle_cancel();

    confirm_btn.addEventListener('click', this.confirm_handler);
    cancel_btn.addEventListener('click', this.cancel_handler);
  }

  on_exit(component)
  {
    super.on_exit(component);

    const confirm_btn = this.container.querySelector('.confirm-btn');
    const cancel_btn = this.container.querySelector('.cancel-btn');

    confirm_btn.removeEventListener('click', this.confirm_handler);
    cancel_btn.removeEventListener('click', this.cancel_handler);
  }

  set_message(title, message, on_confirm)
  {
    const title_el = this.container.querySelector('.modal__title');
    const message_el = this.container.querySelector('.modal__text');

    title_el.textContent = title;
    message_el.textContent = message;
    this.on_confirm_callback = on_confirm;
  }

  handle_confirm()
  {
    if (this.on_confirm_callback)
    {
      this.on_confirm_callback();
    }
    ModalComponent.hide();
  }

  handle_cancel()
  {
    ModalComponent.hide();
  }
}

export { ConfirmDialogModalState };
```

### Pug Template

```pug
+modal({ 
  classes: 'confirm-dialog',
  show_close_icon: true 
})

  +modal_header
    .modal__title Confirm Action

  +modal_body
    .modal__text Are you sure you want to proceed?

  +modal_footer
    .button.button--secondary.cancel-btn Cancel
    .button.button--primary.confirm-btn Confirm
```

### SCSS

```scss
.confirm-dialog {
  .modal__content {
    max-width: 400px;
    text-align: center;
  }

  .modal__title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .modal__text {
    color: #666;
    line-height: 1.5;
  }
}
```

### Usage

```javascript
// Show confirmation modal
const confirm_state = ModalComponent.states.confirm_dialog;
confirm_state.set_message(
  'Delete Item',
  'This action cannot be undone.',
  () => {
    console.log('Item deleted');
    // Perform deletion
  }
);
ModalComponent.show_state('confirm_dialog');
```

## Debugging Modals

- **Console**: Check if `ModalComponent.hidden` reflects the correct state
- **DOM Inspection**: Verify `.modal__container` has correct classes applied
- **Collision Layer**: Test if clicks are properly handled by UICollisionLayer
- **Event Listeners**: Ensure listeners are added in `on_enter()` and removed in `on_exit()`

## Related Topics

- [UI Collision Layer](../components/docs/UICollisionLayer.md) - Click handling system
- [Creating Views](creating-views.md) - Integrate modals with views
- [Creating Components](creating-components.md) - Build reusable UI components

---

For more about the components library, see the [components documentation](../components/docs/).
