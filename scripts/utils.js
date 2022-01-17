/*
 * NOTE: Currently loaded in 'content' scripts, but not in background/popup (issues...)
 */

/**
 * Detect anti-blocker popups (if present)
 *
 * @param   {object}  documentRef - Browser document reference
 * @returns {boolean} Whether an anti-blocker popup was detected
 */
const detectAntiBlockerPopup = (documentRef) => {
  const popup = getAntiBlockerPopup(documentRef);
  return Boolean(popup);
};

/**
 * Get anti-blocker popup elements (if present)
 *
 * @param   {object} documentRef - Browser document reference
 * @returns {object} Anti-blocker popup elements
 */
const getAntiBlockerPopup = (documentRef) => {
  const popupBody = documentRef.querySelector(".tp-modal-open");
  if (!popupBody) return null;

  const popupBackdrop = documentRef.querySelector(".tp-backdrop");
  const popupModal = documentRef.querySelector(".tp-modal");

  return {
    backdrop: popupBackdrop || null,
    body: popupBody || null,
    modal: popupModal || null,
  };
};

/**
 * Hide anti-blocker popups (if present)
 *
 * @param   {object}  documentRef - Browser document reference
 * @returns {boolean} Whether an anti-blocker popup was hidden
 */
const hideAntiBlockerPopup = (documentRef) => {
  if (!documentRef) return false;

  const popup = getAntiBlockerPopup(documentRef);
  if (!popup) return false;

  // Anti-blocker popups prevent scrolling with a 'body' class
  popup.body && popup.body.classList.remove("tp-modal-open");

  // Anti-blocker popups contain a popup and backdrop that must be hidden
  popup.backdrop && popup.backdrop.remove();
  popup.modal && popup.modal.remove();

  return true;
};

/**
 * Remove an element (if it exists)
 *
 * @param   {object}  documentRef - Browser document reference
 * @param   {string}  className   - Class name of element to remove
 * @returns {boolean} Whether element was removed
 */
const removeElement = (documentRef, className) => {
  if (!documentRef || !className) return false;

  const element = documentRef.querySelector(className);
  if (!element) return false;

  element.remove();
  return true;
};

/**
 * Remove several elements (if any exist)
 *
 * @param   {object}  documentRef - Browser document reference
 * @param   {string}  classNames  - List of class name of elements to remove
 * @returns {boolean} Whether any elements were removed
 */
const removeElements = (documentRef, classNames) => {
  if (!documentRef || !classNames || !classNames.length) return false;

  let anyRemoved = false;

  classNames.forEach((className) => {
    const result = removeElement(documentRef, className);
    anyRemoved = anyRemoved || result;
  });

  return anyRemoved;
};
