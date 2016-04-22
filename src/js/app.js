const imagesLoaded = require('imagesloaded');
const Isotope = require('isotope-layout/dist/isotope.pkgd.js');
const _ = require('lodash');

require('../css/main.css');
const people = require('json!./people.json');

const COLORS = [
  '#7B0051',
  '#00d1c1',
  '#ffb400',
  '#007a87',
  '#ff5a5f',
  '#3fb34f',
  '#ffaa91'
];

const rand = max => Math.floor(max * Math.random());

const getAllTags = people => _.uniq(people.reduce(
  (tags, p) => tags.concat(p.tags || []),
  []
)).sort((a, b) => a.toLowerCase() < b.toLowerCase() ? -1 : 1);

const getTagElement = (tag, onClick) => {
  const div = document.createElement('div');

  div.className = 'tag';
  div.innerHTML = tag;
  div.onclick = e => onClick(e, div);

  return div;
};

const getTagElements = (tags, onClick) => {
  const tagElements = tags.map(
    tag => getTagElement(tag, (e, tagElement) => {
      e.preventDefault();

      const cl = tagElement.classList;
      const isAdding = !cl.contains('active');

      tagElements.forEach(t => t.classList.remove('active'));

      if (isAdding) {
        cl.add('active');
        onClick(tag);
      } else {
        onClick('');
      }
    })
  );

  return tagElements;
};

const getStatHTML = (stat) => {
  stat = stat || {};
  const label = stat.label || '???';
  const value = stat.value || '?';

  return `
<tr>
  <th class="air-card__stats__label">
    ${label}
  </th>
  <td class="air-card__stats__value">
    ${value}
  </td>
</tr>
`;

}

const getCardElement = (person, id) => {
  const div = document.createElement('div');
  const color = COLORS[rand(COLORS.length)];

  div.className = 'grid-item';
  div.setAttribute('data-id', id);

  const stats = person.stats || [];
  const imageURL = `src/img/${person.firstName.toLowerCase()}_${person.lastName.toLowerCase()}.jpg`;

  div.innerHTML = `
<div class="air-card-container">
  <div class="air-card" style="background-color: ${color}; border-color: ${color};">
    <div class="air-card__image">
      <a href="${person.profile}">
        <div class="image" style="background-image:url(${imageURL})"></div>
      </a>
    </div>
    <div class="air-card__name">
      ${person.firstName} ${person.lastName}
    </div>
    <div class="air-card__info">
      <div class="air-card__info__label">
        Team
      </div>
      <div class="air-card__info__value">
        ${person.team}
      </div>
    </div>
    <div class="air-card__info">
      <div class="air-card__info__label">
        Role
      </div>
      <div class="air-card__info__value">
        ${person.role}
      </div>
    </div>
    <div class="air-card__hr"></div>
    <div class="air-card__info">
      <div class="air-card__info__label">
        Stats
      </div>
      <div class="air-card__info__value">
        <table class="air-card__stats">
          <tbody>
            ${getStatHTML(stats[0])}
            ${getStatHTML(stats[1])}
            ${getStatHTML(stats[2])}
          </tbody>
        </table>
      </div>
    </div>
    <div class="air-card__footer">
      <a href="mailto:${person.email}">
        <i class="icon icon-white icon-envelope"></i>
      </a>
      <a href="${person.profile}">
        <i class="icon icon-white icon-birdhouse"></i>
      </a>
    </div>
  </div>
</div>
`;

  return div;
};

const getCardElements = people => people.map(getCardElement);

const makeHeaderFixed = () => {
  const header = document.getElementById('header');
  const height = header.offsetHeight;

  header.style.position = 'fixed';

  const app = document.getElementById('app');
  app.style.marginTop = height + 'px';
};

const render = () => {
  const grid = document.getElementById('grid');
  getCardElements(people).forEach(card => grid.appendChild(card));
  grid.style.visibility = 'hidden';

  let isotope;
  imagesLoaded(grid, () => {
    isotope = new Isotope(grid, {
      itemSelector: '.grid-item',
    });
    grid.style.visibility = 'visible';
  });

  const header = document.getElementById('header');
  const filterHeader = document.getElementById('filter-header');

  const tagsContainer = document.getElementById('tags');
  const tagsInner = document.createElement('div');
  tagsContainer.appendChild(tagsInner);

  let preventCollapse = false;

  const expand = () => {
    if (header.classList.contains('expanded')) {
      return;
    }

    header.classList.add('expanding');
    tagsContainer.style.height = tagsInner.offsetHeight + 'px';
    setTimeout(() => {
      header.classList.remove('collapsed');
      header.classList.remove('expanding');
      header.classList.add('expanded');
    }, 200);
  };

  const collapse = () => {
    tagsContainer.style.height = '';
    header.classList.remove('expanded');
    header.classList.add('collapsed');
  };

  header.addEventListener('touchstart', expand, false);
  header.addEventListener('mouseenter', expand, false);
  header.addEventListener('mouseleave', collapse, false);

  getTagElements(getAllTags(people), (tag) => {
    collapse();

    if (tag) {
      filterHeader.innerHTML = `Ask us about <strong>${tag}</strong>`;
    } else {
      filterHeader.innerHTML = '';
    }

    isotope.arrange({
      filter: elem => {
        if (!tag) {
          return true;
        }

        const id = parseInt(elem.getAttribute('data-id'), 10);
        const person = people[id];
        const tags = person.tags || [];

        return tags.indexOf(tag) !== -1;
      }
    });
  }).forEach(tag => tagsInner.appendChild(tag));


};

render();

console.log('%cOh hey, no, code quality not found.', 'font-weight: bold; font-size: 18px;');
