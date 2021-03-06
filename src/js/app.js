const imagesLoaded = require('imagesloaded');
const Isotope = require('isotope-layout/dist/isotope.pkgd.js');
const _ = require('lodash');

require('../css/main.css');
let people = _.shuffle(require('json!./people.json'));

const COLORS = [
  '#7B0051',
  '#00d1c1',
  '#ffb400',
  '#007a87',
  '#ff5a5f',
  '#3fb34f',
  '#ffaa91'
];

const TEAMS = {
  'Talent Partners': {
    icon: 'icon-group-alt',
    color: '#7B0051'
  },
  'Engineering': {
    icon: 'icon-code',
    color: '#00d1c1'
  },
  'Communications': {
    icon: 'icon-intercom',
    color: '#ffb400'
  },
  'Design': {
    icon: 'icon-edit',
    color: '#007a87'
  },
  'VR North America': {
    icon: 'icon-castle',
    color: '#ffb400'
  },
  'Mysteries': {
    icon: 'icon-question-alt',
    color: '#ff5a5f'
  },
  'ITX': {
    icon: 'icon-laptop',
    color: '#ff5a5f'
  },
  'Public Policy - Justice': {
    icon: 'icon-description-alt',
    color: '#3fb34f'
  },
  'Data Engineering': {
    icon: 'icon-stats',
    color: '#007a87'
  },
  'FP&A': {
    icon: 'icon-currency-usd',
    color: '#ffaa91'
  }
};


const tagRemapping = {
  'bicycles': 'Cycling',
  'bikes': 'Cycling',
  'bike commuting': 'Cycling',
  'biking': 'Cycling',
  'new york city': 'New York',
  'nyc': 'New York',
  'college football': 'Football',
  'new england patriots': 'Football',
  'boston red sox': 'Baseball',
  'san francisco giants': 'Baseball',
  'golden state warriors': 'Basketball',
  'react': 'JavaScript',
  'sushi': 'Asian Food',
  'parenting': 'Being a Parent',
  'french language': 'French',
  'the south': 'Southern hospitality',
  'raising sons': 'Being a Parent',
  'raising daughters': 'Being a Parent',
  'being middle child': 'Being a middle child',
  'Good reads': 'Books',
  'books': 'Books',
  'korean food': 'Asian Food',
};

// Clean up tags a bit
people = people.map(person => {
  person.tags = person.tags.map(tag => tagRemapping[tag.toLowerCase()] || tag);
  return person;
});

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
  // const color = COLORS[rand(COLORS.length)];

  const { team, role } = person;
  const color = TEAMS[team].color;
  const teamIcon = TEAMS[team].icon;

  const titleLine = `${team} / ${role}`;

  div.className = 'grid-item';
  div.setAttribute('data-id', id);

  const stats = person.stats || [];
  const imageURL = `src/img/${person.firstName.toLowerCase()}_${person.lastName.toLowerCase()}.jpg`;

  div.innerHTML = `
<div class="air-card-container">
  <div class="air-card" style="background-color: ${color}; border-color: ${color};">
    <div class="air-card__profile">
      <div class="air-card__image">
        <a href="${person.profile}" target="_blank">
          <div class="image" style="background-image:url(${imageURL})"></div>
        </a>
      </div>
      <div class="air-card__content">
        <div class="air-card__name">
          ${person.firstName} ${person.lastName}
          <div class="air-card__icons">
            <i title="${titleLine}" class="icon ${teamIcon}"></i>
          </div>
        </div>
        <div class="air-card__role">
          ${titleLine}
        </div>
      </div>
    </div>
    <div class="air-card__info">
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
    setTimeout(() => {
      header.classList.add('collapsed');
    }, 0);
  };

  header.addEventListener('touchstart', expand, false);
  header.addEventListener('mouseenter', expand, false);
  header.addEventListener('mouseleave', collapse, false);

  getTagElements(getAllTags(people), (tag) => {
    document.body.scrollTop = 0;
    setTimeout(() => {
      collapse();

      setTimeout(() => {
        if (tag) {
          filterHeader.innerHTML = `Talk to us about <strong>${tag}</strong>:`;
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
      }, 200);
    }, 50);
  }).forEach(tag => tagsInner.appendChild(tag));
};

render();

console.log('%cOh hey, no, code quality not found.', 'font-weight: bold; font-size: 18px;');
