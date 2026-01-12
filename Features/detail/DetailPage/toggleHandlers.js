import { addTapListener } from '../../../Utils/addTapListener.js';

export function attachToggleInfoHandlers(container) {
  container.querySelectorAll('.toggle-info').forEach(el => {
    el.onclick = e => {
      e.stopPropagation();
      const info = el.querySelector('.info-text');
      if (!info) return;
      const indicator = el.querySelector('.toggle-info-indicator');
      const isHidden = info.classList.toggle('hidden');
      const expanded = !isHidden;
      if (indicator) indicator.textContent = expanded ? 'Hide' : 'Show';
      el.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      el.classList.toggle('is-expanded', expanded);
    };
  });
}

export function attachSsToggleHandlers(container) {
  container.querySelectorAll('.ss-toggle').forEach(toggle => {
    addTapListener(toggle, e => {
      e.stopPropagation();
      const targetId = toggle.dataset.ssTarget;
      if (!targetId) return;
      const list = container.querySelector(`#${targetId}`);
      if (!list) return;
      const isHidden = list.classList.toggle('hidden');
      const expanded = !isHidden;
      const indicator = toggle.querySelector('.toggle-info-indicator');
      if (indicator) indicator.textContent = expanded ? 'Hide' : 'Show';
      toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      toggle.classList.toggle('is-expanded', expanded);
    });
  });
}

export function attachToggleCategoryHandlers(container) {
  container.querySelectorAll('.toggle-category').forEach(header => {
    addTapListener(header, () => {
      const content = header.nextElementSibling;
      if (!content) return;
      const indicator = header.querySelector('.section-indicator');
      const isHidden = content.classList.toggle('hidden');
      const expanded = !isHidden;
      if (indicator) indicator.textContent = expanded ? 'Hide' : 'Show';
      header.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      header.classList.toggle('is-expanded', expanded);
    });
  });
}
