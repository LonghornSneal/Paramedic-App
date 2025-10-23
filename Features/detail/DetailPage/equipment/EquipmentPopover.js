import { addTapListener } from '../../../../Utils/addTapListener.js';

let equipmentPopover;
let equipmentPopoverImage;
let equipmentPopoverCaption;
let equipmentPopoverSourceLink;
let equipmentPopoverCloseButton;
let equipmentPopoverPinnedTrigger = null;
let equipmentPopoverActiveTrigger = null;
let equipmentPopoverHideTimer;
let equipmentPopoverEventsBound = false;
let equipmentPopoverCredit;
let equipmentPopoverOpenViewerButton;
let equipmentViewer;
let equipmentViewerPanel;
let equipmentViewerImage;
let equipmentViewerMedia;
let equipmentViewerCaption;
let equipmentViewerSourceLink;
let equipmentViewerCloseButton;
let equipmentViewerZoomDisplay;
let equipmentViewerSizeDisplay;
let equipmentViewerZoom = 1;
let equipmentViewerTranslateX = 0;
let equipmentViewerTranslateY = 0;
let equipmentViewerWidthRatio = 0.6;
let equipmentViewerIsPanning = false;
let equipmentViewerPanStartX = 0;
let equipmentViewerPanStartY = 0;

function ensureEquipmentViewerElements() {
  if (equipmentPopoverCloseButton) return;
  if (!equipmentPopover) return;
  equipmentPopoverImage = equipmentPopover.querySelector('.equipment-popover-image');
  equipmentPopoverCaption = equipmentPopover.querySelector('.equipment-popover-caption');
  equipmentPopoverCredit = equipmentPopover.querySelector('.equipment-popover-credit');
  equipmentPopoverSourceLink = equipmentPopover.querySelector('.equipment-popover-source');
  equipmentPopoverCloseButton = equipmentPopover.querySelector('.equipment-popover-close');
  if (equipmentPopoverCloseButton) {
    equipmentPopoverCloseButton.addEventListener('click', () => hideEquipmentPopover(true, true));
  }
}

export function ensureEquipmentPopover() {
  if (typeof document === 'undefined') {
    return;
  }
  if (equipmentPopover) {
    ensureEquipmentViewerElements();
    return;
  }
  equipmentPopover = document.createElement('div');
  equipmentPopover.className = 'equipment-popover hidden';
  equipmentPopover.setAttribute('role', 'dialog');
  equipmentPopover.setAttribute('aria-modal', 'false');
  equipmentPopover.innerHTML = `
        <div class="equipment-popover-content">
            <button type="button" class="equipment-popover-close" aria-label="Close image preview">&times;</button>
            <img class="equipment-popover-image" alt="" />
            <p class="equipment-popover-caption"></p>
            <p class="equipment-popover-credit hidden"></p>
            <a class="equipment-popover-source" target="_blank" rel="noopener">Image source</a>
        </div>
    `;
  document.body.appendChild(equipmentPopover);
  ensureEquipmentViewerElements();
  equipmentPopover.addEventListener('mouseenter', () => {
    if (equipmentPopoverHideTimer) {
      clearTimeout(equipmentPopoverHideTimer);
      equipmentPopoverHideTimer = null;
    }
  });
  equipmentPopover.addEventListener('mouseleave', () => {
    if (!equipmentPopoverPinnedTrigger) {
      hideEquipmentPopover();
    }
  });
  equipmentPopover.addEventListener('keydown', evt => {
    if (evt.key === 'Escape') {
      hideEquipmentPopover(true, true);
    }
  });
  if (!equipmentPopoverEventsBound && typeof window !== 'undefined') {
    equipmentPopoverEventsBound = true;
    window.addEventListener('scroll', () => {
      const anchor = equipmentPopoverPinnedTrigger || equipmentPopoverActiveTrigger;
      if (anchor && !equipmentPopover.classList.contains('hidden')) {
        positionEquipmentPopover(anchor);
      }
    }, { passive: true });
    window.addEventListener('resize', () => {
      const anchor = equipmentPopoverPinnedTrigger || equipmentPopoverActiveTrigger;
      if (anchor && !equipmentPopover.classList.contains('hidden')) {
        positionEquipmentPopover(anchor);
      }
    });
  }
}

function positionEquipmentPopover(trigger) {
  if (!equipmentPopover || !trigger || typeof window === 'undefined') {
    return;
  }
  const rect = trigger.getBoundingClientRect();
  const popRect = equipmentPopover.getBoundingClientRect();
  const scrollX = (typeof window.scrollX === 'number' ? window.scrollX : window.pageXOffset) || 0;
  const scrollY = (typeof window.scrollY === 'number' ? window.scrollY : window.pageYOffset) || 0;
  const viewportWidth = (document.documentElement ? document.documentElement.clientWidth : window.innerWidth) || popRect.width;
  const viewportHeight = (document.documentElement ? document.documentElement.clientHeight : window.innerHeight) || popRect.height;
  let left = scrollX + rect.left + (rect.width / 2) - (popRect.width / 2);
  let top = scrollY + rect.bottom + 8;
  const maxLeft = scrollX + viewportWidth - popRect.width - 12;
  const minLeft = scrollX + 12;
  if (!isFinite(left)) {
    left = minLeft;
  }
  left = Math.max(minLeft, Math.min(left, maxLeft));
  const maxTop = scrollY + viewportHeight - popRect.height - 12;
  if (top > maxTop) {
    top = scrollY + rect.top - popRect.height - 12;
  }
  const minTop = scrollY + 12;
  top = Math.max(minTop, top);
  equipmentPopover.style.left = `${Math.round(left)}px`;
  equipmentPopover.style.top = `${Math.round(top)}px`;
}

export function showEquipmentPopover(trigger, shouldPin) {
  if (!trigger) {
    return;
  }
  ensureEquipmentPopover();
  if (!equipmentPopover) {
    return;
  }
  if (equipmentPopoverHideTimer) {
    clearTimeout(equipmentPopoverHideTimer);
    equipmentPopoverHideTimer = null;
  }
  if (shouldPin && equipmentPopoverPinnedTrigger && equipmentPopoverPinnedTrigger !== trigger) {
    equipmentPopoverPinnedTrigger.classList.remove('equipment-popover-pinned', 'equipment-popover-active');
    equipmentPopoverPinnedTrigger.setAttribute('aria-expanded', 'false');
    equipmentPopoverPinnedTrigger = null;
  }
  if (!shouldPin && equipmentPopoverPinnedTrigger && equipmentPopoverPinnedTrigger !== trigger) {
    return;
  }
  if (equipmentPopoverActiveTrigger && equipmentPopoverActiveTrigger !== trigger && equipmentPopoverActiveTrigger !== equipmentPopoverPinnedTrigger) {
    equipmentPopoverActiveTrigger.classList.remove('equipment-popover-active');
    equipmentPopoverActiveTrigger.setAttribute('aria-expanded', 'false');
  }
  equipmentPopoverActiveTrigger = trigger;
  trigger.classList.add('equipment-popover-active');
  trigger.setAttribute('aria-expanded', 'true');
  if (shouldPin || equipmentPopoverPinnedTrigger === trigger) {
    equipmentPopoverPinnedTrigger = trigger;
    trigger.classList.add('equipment-popover-pinned');
  } else {
    trigger.classList.remove('equipment-popover-pinned');
  }
  const caption = trigger.dataset.equipmentCaption || trigger.textContent.trim();
  const altText = trigger.dataset.equipmentAlt || caption || 'Equipment image';
  const src = trigger.dataset.equipmentImage;
  const sourceHref = trigger.dataset.equipmentSource;
  const sourceLabel = trigger.dataset.equipmentSourceLabel || 'Image source';
  if (equipmentPopoverImage) {
    if (src) {
      if (equipmentPopoverImage.src !== src) {
        equipmentPopoverImage.src = src;
      }
      equipmentPopoverImage.alt = altText;
      equipmentPopoverImage.classList.remove('hidden');
    } else {
      equipmentPopoverImage.removeAttribute('src');
      equipmentPopoverImage.alt = '';
      equipmentPopoverImage.classList.add('hidden');
    }
  }
  if (equipmentPopoverCaption) {
    equipmentPopoverCaption.textContent = caption || '';
    equipmentPopoverCaption.classList.toggle('hidden', !caption);
  }
  if (equipmentPopoverCredit) {
    const creditText = trigger.dataset.equipmentCredit || '';
    const noteText = trigger.dataset.equipmentSourceNote || '';
    const combinedCredit = noteText ? (creditText ? `${creditText} - ${noteText}` : noteText) : creditText;
    equipmentPopoverCredit.textContent = combinedCredit || '';
    equipmentPopoverCredit.classList.toggle('hidden', !combinedCredit);
  }
  if (equipmentPopoverSourceLink) {
    if (sourceHref) {
      equipmentPopoverSourceLink.href = sourceHref;
      equipmentPopoverSourceLink.textContent = sourceLabel;
      equipmentPopoverSourceLink.classList.remove('hidden');
    } else {
      equipmentPopoverSourceLink.removeAttribute('href');
      equipmentPopoverSourceLink.classList.add('hidden');
    }
  }
  equipmentPopover.classList.remove('hidden');
  equipmentPopover.setAttribute('aria-hidden', 'false');
  equipmentPopover.style.visibility = 'hidden';
  positionEquipmentPopover(trigger);
  equipmentPopover.style.visibility = 'visible';
}

export function hideEquipmentPopover(immediate = false, force = false) {
  if (!equipmentPopover) {
    return;
  }
  const performHide = () => {
    if (equipmentPopoverPinnedTrigger && !force) {
      return;
    }
    const focusTarget = force ? (equipmentPopoverPinnedTrigger || equipmentPopoverActiveTrigger) : null;
    if (equipmentPopoverPinnedTrigger) {
      equipmentPopoverPinnedTrigger.classList.remove('equipment-popover-pinned', 'equipment-popover-active');
      equipmentPopoverPinnedTrigger.setAttribute('aria-expanded', 'false');
      equipmentPopoverPinnedTrigger = null;
    }
    if (equipmentPopoverActiveTrigger) {
      equipmentPopoverActiveTrigger.classList.remove('equipment-popover-active');
      equipmentPopoverActiveTrigger.setAttribute('aria-expanded', 'false');
      equipmentPopoverActiveTrigger = null;
    }
    equipmentPopover.classList.add('hidden');
    equipmentPopover.setAttribute('aria-hidden', 'true');
    equipmentPopover.style.visibility = 'visible';
    if (equipmentPopoverImage) {
      equipmentPopoverImage.removeAttribute('src');
    }
    if (force && focusTarget && typeof focusTarget.focus === 'function') {
      focusTarget.focus();
    }
  };
  if (equipmentPopoverHideTimer) {
    clearTimeout(equipmentPopoverHideTimer);
    equipmentPopoverHideTimer = null;
  }
  if (immediate) {
    performHide();
  } else {
    equipmentPopoverHideTimer = setTimeout(performHide, 120);
  }
}

export function initializeEquipmentPopovers(container) {
  if (!container || typeof document === 'undefined') {
    return;
  }
  const triggers = container.querySelectorAll('.equipment-popover-trigger');
  if (!triggers.length) {
    return;
  }
  ensureEquipmentPopover();
  triggers.forEach(trigger => {
    if (trigger.dataset.equipmentPopoverBound === 'true') {
      return;
    }
    trigger.dataset.equipmentPopoverBound = 'true';
    trigger.setAttribute('aria-haspopup', 'dialog');
    if (!trigger.hasAttribute('tabindex')) {
      trigger.setAttribute('tabindex', '0');
    }
    trigger.setAttribute('role', 'button');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.classList.add('equipment-popover-trigger-ready');
    const handleEnter = () => {
      if (equipmentPopoverPinnedTrigger && equipmentPopoverPinnedTrigger !== trigger) {
        return;
      }
      showEquipmentPopover(trigger, false);
    };
    const handleLeave = () => {
      if (equipmentPopoverPinnedTrigger === trigger) {
        return;
      }
      hideEquipmentPopover();
    };
    trigger.addEventListener('mouseenter', handleEnter);
    trigger.addEventListener('focus', handleEnter);
    trigger.addEventListener('mouseleave', handleLeave);
    trigger.addEventListener('blur', handleLeave);
    trigger.addEventListener('keydown', evt => {
      if (evt.key === 'Enter' || evt.key === ' ') {
        evt.preventDefault();
        showEquipmentPopover(trigger, true);
      } else if (evt.key === 'Escape' && (equipmentPopoverPinnedTrigger === trigger || equipmentPopoverActiveTrigger === trigger)) {
        evt.preventDefault();
        hideEquipmentPopover(true, true);
      }
    });
    addTapListener(trigger, evt => {
      evt.preventDefault();
      showEquipmentPopover(trigger, true);
    });
  });
}
