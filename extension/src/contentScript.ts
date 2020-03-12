// Arrive attaches to DOM, does not support TS
require('arrive');

const path: string =
  'ytd-video-primary-info-renderer #top-level-buttons';

(document as any).arrive(path, function() {
  const element: HTMLElement = document.querySelector(
    path
  ) as HTMLElement;

  //TODO: Remember to handle dark mode and mode change
  const button = document.createElement('button');
  button.innerHTML = 'doopa';
  element.appendChild(button);
});
