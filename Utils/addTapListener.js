// Utils/addTapListener.js – Utility to handle click or keypress (Enter/Space) on an element
export function addTapListener(element, handler) { 
    if (!element) return;
    // Unified handler for click or keyboard "activate" events
    const activate = (e) => { 
        if (e.type === 'click' || (e.type === 'keypress' && (e.key === 'Enter' || e.key === ' '))) {
            e.preventDefault();
            handler(e); 
        }
    };
    element.addEventListener('click', activate);
    element.addEventListener('keypress', activate); 
}
