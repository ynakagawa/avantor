import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const container = document.createElement('div');
  container.className = 'cards-highlight-container';

  const heading = document.createElement('h2');
  heading.textContent = 'Highlights';
  container.append(heading);

  const ul = document.createElement('ul');
  [...block.children].slice(1).forEach((row, index) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    const cells = [...row.children];
    const firstCell = cells[0];
    const isCardLabel = firstCell && firstCell.textContent.trim().toLowerCase() === 'card';
    (isCardLabel ? cells.slice(1) : cells).forEach((cell) => li.append(cell));
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-highlight-card-image';
      else div.className = 'cards-highlight-card-body';
    });
    li.querySelectorAll('p').forEach((p) => {
      if (p.textContent.trim().toLowerCase() === 'card') p.remove();
    });
    if (index === 0) li.classList.add('highlighted');
    else if (index >= 1 && index <= 3) li.classList.add('unhighlighted');
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  container.append(ul);
  block.textContent = '';
  block.append(container);
}
