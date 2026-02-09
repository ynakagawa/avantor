/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-brand block
 *
 * Source: https://www.avantorsciences.com/us/en/
 * Base Block: cards
 *
 * Block Structure (from markdown):
 * - Each row = 1 card (2 columns: logo image | linked brand name)
 *
 * Source HTML Pattern (Spartacus):
 * app-cmscard-container
 *   h2.av-cards-title                     (section heading - NOT part of block)
 *   .Auto_Fit > app-card                  (card items, Simple_Card type)
 *     .avtr-card.Simple_Card
 *       .avtr-card-media cx-media img     (brand logo image)
 *       .avtr-card-title app-generic-link a  (linked brand name)
 *
 * Generated: 2026-02-09
 */
export default function parse(element, { document }) {
  // Get all card items
  // VALIDATED: .avtr-card.Simple_Card found in captured DOM for brand cards
  const cards = Array.from(element.querySelectorAll('.avtr-card.Simple_Card'));

  if (cards.length === 0) {
    const appCards = Array.from(element.querySelectorAll('.Auto_Fit > app-card'));
    cards.push(...appCards.map((c) => c.querySelector('.avtr-card')).filter(Boolean));
  }

  const cells = [];

  for (const card of cards) {
    // Extract brand logo image
    // VALIDATED: .avtr-card-media cx-media img found in captured DOM
    const logoImage = card.querySelector('.avtr-card-media cx-media img') ||
                      card.querySelector('.avtr-card-media img') ||
                      card.querySelector('img');

    // Extract brand name with link
    // VALIDATED: .avtr-card-title app-generic-link a found in captured DOM
    const brandLink = card.querySelector('.avtr-card-title app-generic-link a') ||
                      card.querySelector('.avtr-card-title a') ||
                      card.querySelector('a[href]');

    const brandName = card.querySelector('.avtr-card-title');

    // Build row: [logo image, linked brand name]
    const col1 = [];
    if (logoImage) col1.push(logoImage);

    const col2 = [];
    if (brandLink) {
      col2.push(brandLink);
    } else if (brandName) {
      col2.push(brandName);
    }

    if (col1.length > 0 || col2.length > 0) {
      cells.push([col1, col2]);
    }
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Brand', cells });
  element.replaceWith(block);
}
