const DATA_URL = 'domains.json';
const PAGE_SIZE = 12; // show 12 per page – looks better

let domains = [];
let currentPage = 1;

async function loadDomains() {
  try {
    const res = await fetch(DATA_URL + '?_=' + Date.now());
    domains = await res.json();
    renderPage(currentPage);
    renderPagination();
  } catch (err) {
    console.error('Failed to load domains.json', err);
    document.getElementById('domains-grid').innerHTML =
      '<p class="text-red-500 text-center">Failed to load listings.</p>';
  }
}

function renderPage(page) {
  currentPage = page;
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = domains.slice(start, start + PAGE_SIZE);

  const container = document.getElementById('domains-grid');
  container.innerHTML = '';

  pageItems.forEach((d) => {
    const card = document.createElement('div');
    card.className =
      'bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition';

    card.innerHTML = `
      <div class="relative bg-black flex justify-center items-center" style="height: 200px;">
        <img src="${d.logo}" 
             alt="${d.name} preview"
             class="max-h-full max-w-full object-contain p-2">
      </div>

      <div class="p-5 flex flex-col flex-1 justify-between">
        <div>
          <h3 class="text-xl font-bold text-primary mb-1">
            <a href="${d.marketplace_link}" target="_blank">${d.name}</a>
          </h3>
          <p class="text-softGray text-sm mb-2 leading-relaxed">
            ${d.tagline || ''}
          </p>
          <p class="text-accent font-semibold mb-3">${d.price || ''}</p>
        </div>

        <a href="${d.marketplace_link}" 
           target="_blank"
           class="mt-3 inline-block bg-primary text-gray-900 px-4 py-2 rounded-lg 
                  hover:bg-accent hover:text-black transition font-semibold text-center">
          View Listing
        </a>
      </div>
    `;

    container.appendChild(card);
  });
}

function renderPagination() {
  const totalPages = Math.ceil(domains.length / PAGE_SIZE);
  const container = document.getElementById('pagination');
  container.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.className =
      `px-3 py-1 rounded-lg text-sm font-medium ` +
      (i === currentPage
        ? 'bg-primary text-gray-900'
        : 'bg-gray-700 text-softGray hover:bg-primary hover:text-black transition');

    btn.addEventListener('click', () => {
      renderPage(i);
      renderPagination();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    container.appendChild(btn);
  }
}

document.addEventListener('DOMContentLoaded', loadDomains);
