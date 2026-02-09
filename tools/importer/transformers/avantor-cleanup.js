/* eslint-disable */
/* global WebImporter */

/**
 * Transformer for Avantor Sciences website cleanup
 * Purpose: Remove non-content elements and fix DOM issues for import
 * Applies to: www.avantorsciences.com (all templates)
 * Generated: 2026-02-09
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM during migration workflow (cleaned.html analysis)
 * - SAP Spartacus Angular app structure identified in page analysis
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove Spartacus header/navigation components
    // EXTRACTED: Found cx-page-slot.SiteLogo, cx-page-slot.NavigationBar in captured DOM
    WebImporter.DOMUtils.remove(element, [
      'cx-page-slot.SiteLogo',
      'cx-page-slot.NavigationBar',
      'cx-page-slot.MiniCart',
      'cx-page-slot.SearchBox',
      'cx-page-slot.SiteLogin',
      'cx-page-slot.SiteContext',
      'cx-page-slot.SiteLinks',
      'cx-page-slot.BottomHeaderSlot',
    ]);

    // Remove Spartacus footer components
    // EXTRACTED: Found cx-page-slot.Footer in captured DOM
    WebImporter.DOMUtils.remove(element, [
      'cx-page-slot.Footer',
      'cx-page-slot.BottomContent',
    ]);

    // Remove chat widget (Chatlayer)
    // EXTRACTED: Found chatlayer-web-widget element in captured DOM
    WebImporter.DOMUtils.remove(element, [
      'chatlayer-web-widget',
      '#chatlayer-widget',
    ]);

    // Remove cookie/consent banners
    // EXTRACTED: Found OneTrust consent elements in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#onetrust-banner-sdk',
      '.onetrust-pc-dark-filter',
      '.optanon-alert-box-wrapper',
    ]);

    // Remove tracking/analytics elements
    // EXTRACTED: Found tracking pixels and scripts in captured DOM
    WebImporter.DOMUtils.remove(element, [
      'iframe[src*="demdex.net"]',
      'iframe[src*="google.com/pagead"]',
      'img[src*="tr.lfeeder.com"]',
    ]);

    // Remove empty Spartacus section slots (no content)
    // EXTRACTED: Section2A, Section2B, Section2C are empty in captured DOM
    WebImporter.DOMUtils.remove(element, [
      'cx-page-slot.Section2A',
      'cx-page-slot.Section2B',
      'cx-page-slot.Section2C',
    ]);

    // Remove dynamic/personalized recommendation carousel
    // EXTRACTED: Found app-product-carousel in captured DOM (cannot be statically migrated)
    WebImporter.DOMUtils.remove(element, [
      'app-product-carousel',
    ]);

    // Re-enable scrolling if blocked by modals
    if (element.style && element.style.overflow === 'hidden') {
      element.setAttribute('style', 'overflow: scroll;');
    }
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove remaining non-content HTML elements
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'link',
      'noscript',
      'source',
    ]);

    // Clean up Spartacus-specific tracking attributes
    // EXTRACTED: Found data-cx-* attributes on elements in captured DOM
    const allElements = element.querySelectorAll('*');
    allElements.forEach((el) => {
      el.removeAttribute('data-cx-focus-key');
      el.removeAttribute('data-cx-focus-group');
      el.removeAttribute('ng-reflect-cx-feature');
    });
  }
}
