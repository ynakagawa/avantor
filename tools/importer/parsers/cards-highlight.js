/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-highlight block
 *
 * Reference: https://www.avantorsciences.com/us/en/ (Highlights section)
 * Base Block: cards
 *
 * Block Structure (from markdown):
 * - Section title "Highlights" rendered by block; each row = 1 card (image | title + optional description + link)
 * - First card is featured (app-card.highlighted on source)
 *
 * Source HTML Pattern (Spartacus):
 * app-cmscard-container
 *   h2.av-cards-title                     (section heading - NOT part of block)
 *   .Highlights > app-card                (card items, Simple_Card type; first may have .highlighted)
 *     .avtr-card.Simple_Card
 *       .avtr-card-media cx-media img     (card image)
 *       .avtr-card-title app-generic-link a  (linked or plain title)
 *       .avtr-card-body p                 (optional description)
 *
 * Note: Uses .Highlights grid layout (not .Auto_Fit)
 * Some cards have links, some are text-only.
 *
 * Generated: 2026-02-09
 */
export default function parse(element, { document }) {
  // Get all card items
  // VALIDATED: .avtr-card.Simple_Card found in Highlights layout in captured DOM
  const cards = Array.from(element.querySelectorAll('.avtr-card.Simple_Card'));

  if (cards.length === 0) {
    const appCards = Array.from(element.querySelectorAll('.Highlights > app-card'));
    cards.push(...appCards.map((c) => c.querySelector('.avtr-card')).filter(Boolean));
  }

  const cells = [];

  for (const card of cards) {
    // Extract card image
    // VALIDATED: .avtr-card-media cx-media img found in captured DOM
    const cardImage = card.querySelector('.avtr-card-media cx-media img') ||
                      card.querySelector('.avtr-card-media img') ||
                      card.querySelector('img');

    // Extract title (may or may not have link)
    // VALIDATED: .avtr-card-title found in captured DOM
    const titleLink = card.querySelector('.avtr-card-title app-generic-link a') ||
                      card.querySelector('.avtr-card-title a');
    const titleText = card.querySelector('.avtr-card-title');

    // Extract optional description
    // VALIDATED: .avtr-card-body found in some highlight cards
    const bodyEl = card.querySelector('.avtr-card-body');
    let description = null;
    if (bodyEl && bodyEl.textContent.trim()) {
      description = bodyEl;
    }

    // Build row: [image, title + optional description]
    const col1 = [];
    if (cardImage) col1.push(cardImage);

    const col2 = [];
    if (titleLink) {
      col2.push(titleLink);
    } else if (titleText) {
      col2.push(titleText);
    }
    if (description) col2.push(description);

    if (col1.length > 0 || col2.length > 0) {
      cells.push([col1, col2]);
    }
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Highlight', cells });
  element.replaceWith(block);
}
