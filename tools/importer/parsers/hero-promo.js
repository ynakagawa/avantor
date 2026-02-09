/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-promo block
 *
 * Source: https://www.avantorsciences.com/us/en/
 * Base Block: hero
 *
 * Block Structure (from markdown):
 * - Row 1: Background/promo image (1 column)
 * - Row 2: Content - optional pre-title, heading, description, CTA (1 column)
 *
 * Source HTML Patterns (Spartacus):
 * Pattern 1 - Feature_Card_Img_After (MarketSource):
 *   .avtr-card.Feature_Card_Img_After
 *     .avtr-card-pre-title                 (pre-title / heading)
 *     .avtr-card-body                      (description + CTA)
 *     .avtr-card-media cx-media img        (image)
 *
 * Pattern 2 - Content_Cta (Clearance):
 *   .avtr-card.Content_Cta
 *     .avtr-card-media cx-media img        (image)
 *     .avtr-card-pre-title                 (pre-title)
 *     .avtr-card-title                     (heading)
 *     .avtr-card-body                      (description + CTA)
 *
 * Generated: 2026-02-09
 */
export default function parse(element, { document }) {
  // Extract image
  // VALIDATED: .avtr-card-media cx-media img found in both card types
  const promoImage = element.querySelector('.avtr-card-media cx-media img') ||
                     element.querySelector('.avtr-card-media img') ||
                     element.querySelector('img');

  // Extract pre-title (optional)
  // VALIDATED: .avtr-card-pre-title found in captured DOM
  const preTitle = element.querySelector('.avtr-card-pre-title');

  // Extract title/heading
  // VALIDATED: .avtr-card-title found in Content_Cta card type
  // For Feature_Card_Img_After, pre-title acts as heading
  const title = element.querySelector('.avtr-card-title') ||
                element.querySelector('h2, h1, h3');

  // Extract description
  // VALIDATED: .avtr-card-body found in both card types
  const body = element.querySelector('.avtr-card-body');

  // Extract CTA
  // VALIDATED: a.av-btn found inside .avtr-card-body
  const ctaLink = element.querySelector('.avtr-card-body a.av-btn') ||
                  element.querySelector('a.av-btn') ||
                  element.querySelector('a[href]');

  // Build cells array matching hero-promo block structure
  const cells = [];

  // Row 1: Promo image
  if (promoImage) {
    cells.push([promoImage]);
  }

  // Row 2: Content (pre-title, heading, description, CTA in single cell)
  const contentCell = [];
  if (preTitle) contentCell.push(preTitle);
  if (title) contentCell.push(title);
  // Add body text (excluding CTA which we extract separately)
  if (body) {
    const bodyClone = body.cloneNode(true);
    const ctaInBody = bodyClone.querySelector('a.av-btn');
    if (ctaInBody) ctaInBody.remove();
    if (bodyClone.textContent.trim()) {
      contentCell.push(bodyClone);
    }
  }
  if (ctaLink) contentCell.push(ctaLink);
  cells.push(contentCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero-Promo', cells });
  element.replaceWith(block);
}
