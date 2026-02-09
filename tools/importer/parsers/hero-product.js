/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-product block
 *
 * Source: https://www.avantorsciences.com/us/en/
 * Base Block: hero
 *
 * Block Structure (from markdown):
 * - Row 1: Background image (1 column)
 * - Row 2: Content - heading, description, CTA (1 column)
 *
 * Source HTML Pattern (Spartacus):
 * .avtr-card.Hero_Card
 *   .avtr-card-media cx-media img         (background image)
 *   .avtr-card-title                       (heading)
 *   .avtr-card-body p                      (description)
 *   .avtr-card-body a.av-btn              (CTA)
 *
 * Generated: 2026-02-09
 */
export default function parse(element, { document }) {
  // Extract background/hero image
  // VALIDATED: .avtr-card-media cx-media img found in captured DOM (line 545)
  const heroImage = element.querySelector('.avtr-card-media cx-media img') ||
                    element.querySelector('.avtr-card-media img') ||
                    element.querySelector('img');

  // Extract heading
  // VALIDATED: .avtr-card-title found in captured DOM
  const title = element.querySelector('.avtr-card-title') ||
                element.querySelector('h2, h1, h3');

  // Extract description
  // VALIDATED: .avtr-card-body p found in captured DOM
  const description = element.querySelector('.avtr-card-body p') ||
                      element.querySelector('.avtr-card-body');

  // Extract CTA link
  // VALIDATED: .avtr-card-body a.av-btn found in captured DOM
  const ctaLink = element.querySelector('.avtr-card-body a.av-btn') ||
                  element.querySelector('.avtr-card-body a[href]') ||
                  element.querySelector('a.av-btn');

  // Build cells array matching hero block structure
  const cells = [];

  // Row 1: Background image (optional)
  if (heroImage) {
    cells.push([heroImage]);
  }

  // Row 2: Content (heading, description, CTA in single cell)
  const contentCell = [];
  if (title) contentCell.push(title);
  if (description) contentCell.push(description);
  if (ctaLink) contentCell.push(ctaLink);
  cells.push(contentCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero-Product', cells });
  element.replaceWith(block);
}
