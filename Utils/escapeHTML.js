// Utils/escapeHTML.js – Utility to escape HTML special characters in a string
export function escapeHTML(str) {
    const escapeMap = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return str.replace(/[&<>"']/g, char => escapeMap[char] || char); 
}
