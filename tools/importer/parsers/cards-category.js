/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-category block
 *
 * Source: https://www.avantorsciences.com/us/en/
 * Base Block: cards
 *
 * Block Structure (from markdown):
 * - Each row = 1 card (2 columns: image | linked title)
 *
 * Source HTML Pattern (Spartacus):
 * app-cmscard-container
 *   h2.av-cards-title                     (section heading - NOT part of block)
 *   .Auto_Fit > app-card                  (card items, Simple_Card type)
 *     .avtr-card.Simple_Card
 *       .avtr-card-media cx-media img     (card image)
 *       .avtr-card-title app-generic-link a  (linked title)
 *
 * Note: This container also includes the MarketSource hero-promo as last child.
 * We only process Simple_Card items, NOT Feature_Card_Img_After.
 *
 * Generated: 2026-02-09
 */
export default function parse(element, { document }) {
  // Get all Simple_Card items (exclude Feature_Card_Img_After which is hero-promo)
  // VALIDATED: .avtr-card.Simple_Card found for category cards in captured DOM
  const cards = Array.from(element.querySelectorAll('.avtr-card.Simple_Card'));

  if (cards.length === 0) {
    // Fallback: try all app-card children
    const appCards = Array.from(element.querySelectorAll('.Auto_Fit > app-card'));
    cards.push(...appCards.map((c) => c.querySelector('.avtr-card')).filter(Boolean));
  }

  const cells = [];

  for (const card of cards) {
    // Extract card image
    // VALIDATED: .avtr-card-media cx-media img found in captured DOM
    const cardImage = card.querySelector('.avtr-card-media cx-media img') ||
                      card.querySelector('.avtr-card-media img') ||
                      card.querySelector('img');

    // Extract card title with link
    // VALIDATED: .avtr-card-title app-generic-link a found in captured DOM
    const titleLink = card.querySelector('.avtr-card-title app-generic-link a') ||
                      card.querySelector('.avtr-card-title a') ||
                      card.querySelector('a[href]');

    const titleText = card.querySelector('.avtr-card-title');

    // Build row: [image, linked title]
    const col1 = [];
    if (cardImage) col1.push(cardImage);

    const col2 = [];
    if (titleLink) {
      col2.push(titleLink);
    } else if (titleText) {
      col2.push(titleText);
    }

    if (col1.length > 0 || col2.length > 0) {
      cells.push([col1, col2]);
    }
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Category', cells });
  element.replaceWith(block);
}
