/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-product block
 *
 * Source: https://www.avantorsciences.com/us/en/
 * Base Block: cards
 *
 * Block Structure (from markdown):
 * - Each row = 1 card (2 columns: image | title + description + CTA)
 *
 * Source HTML Pattern (Spartacus):
 * app-cmscard-container
 *   h2.av-cards-title                     (section heading - NOT part of block)
 *   .Auto_Fit > app-card                  (card items, Simple_Card type)
 *     .avtr-card.Simple_Card
 *       .avtr-card-media cx-media img     (card image)
 *       .avtr-card-title                  (card title)
 *       .avtr-card-body p                 (description)
 *       .avtr-card-body a.av-btn          (CTA)
 *
 * Generated: 2026-02-09
 */
export default function parse(element, { document }) {
  // Get all card items
  // VALIDATED: .avtr-card.Simple_Card found in captured DOM for product cards
  const cards = Array.from(element.querySelectorAll('.avtr-card.Simple_Card'));

  if (cards.length === 0) {
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

    // Extract card title
    // VALIDATED: .avtr-card-title found in captured DOM
    const title = card.querySelector('.avtr-card-title');

    // Extract description (first p in body, excluding CTA)
    // VALIDATED: .avtr-card-body found in captured DOM
    const bodyEl = card.querySelector('.avtr-card-body');
    let description = null;
    if (bodyEl) {
      const paragraphs = Array.from(bodyEl.querySelectorAll('p'));
      description = paragraphs.find((p) => !p.querySelector('a.av-btn'));
    }

    // Extract CTA link
    // VALIDATED: a.av-btn found in .avtr-card-body
    const ctaLink = card.querySelector('.avtr-card-body a.av-btn') ||
                    card.querySelector('a.av-btn');

    // Build row: [image, title + description + CTA]
    const col1 = [];
    if (cardImage) col1.push(cardImage);

    const col2 = [];
    if (title) col2.push(title);
    if (description) col2.push(description);
    if (ctaLink) col2.push(ctaLink);

    if (col1.length > 0 || col2.length > 0) {
      cells.push([col1, col2]);
    }
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Product', cells });
  element.replaceWith(block);
}
