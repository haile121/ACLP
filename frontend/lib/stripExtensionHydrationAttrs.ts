/**
 * Inline script (beforeInteractive) — removes attrs injected by security extensions
 * (e.g. Bitdefender `bis_skin_checked`) that cause React hydration mismatches.
 */
export const STRIP_EXTENSION_HYDRATION_ATTRS_SCRIPT = `
(function () {
  var ATTRS = ['bis_skin_checked', 'bis_register'];
  function stripEl(el) {
    if (!el || el.nodeType !== 1 || !el.removeAttribute) return;
    for (var i = 0; i < ATTRS.length; i++) {
      if (el.hasAttribute(ATTRS[i])) el.removeAttribute(ATTRS[i]);
    }
  }
  function stripTree(root) {
    if (!root) return;
    stripEl(root);
    if (root.querySelectorAll) {
      for (var j = 0; j < ATTRS.length; j++) {
        root.querySelectorAll('[' + ATTRS[j] + ']').forEach(stripEl);
      }
    }
  }
  function run() {
    stripTree(document.documentElement);
  }
  run();
  if (typeof MutationObserver !== 'undefined' && document.documentElement) {
    new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var m = mutations[i];
        if (m.type === 'attributes' && m.target) stripEl(m.target);
        if (m.addedNodes) {
          for (var k = 0; k < m.addedNodes.length; k++) stripTree(m.addedNodes[k]);
        }
      }
    }).observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ATTRS,
    });
  }
})();
`;
