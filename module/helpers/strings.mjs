/**
 * Sanitise strings allowing ine breaks to be safely inserted via handebars.
 * @param {string} string      A user-inputted string to be sanitised and broken up
 */
export function sanitiseAndBreak(string) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    "/": '&#x2F;'
  }
  const reg = /[&<>"'/]/ig;
  let safeString = string.replace(reg, (match) => (map[match]));
  return safeString.replace(/\n/g, "<br>");
}