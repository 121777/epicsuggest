const DATA_URL = 'domains.json';
const PAGE_SIZE = 10;

let domains = [];
let currentPage = 1;

async function loadDomains() {
  try {
    const res = await fetch(DATA_URL + '?_=' + Date.now()); // prevent cache
    domains = await res.json();
    renderPage(currentPage);
    renderPagination();
  } catch (err) {
    console.error('Failed to load domains.json', err);
    document.getElementById('domains-grid').innerHTML = '<p class="text-red-500 text-center">Failed to load listings.</p>';
  }
}

function renderPage(page) {
  currentPage = page;
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = domains.slice(start, start + PAGE_SIZE);
  const container = document.getElementById('domains-grid');
  container.innerHTML = '';

  pageItems.forEach((d, idx) => {
    const card = document.createElement('div');
    card.className = 'bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col';
    card.innerHTML = `
      <div class="relative">
        <img src="${d.images[0]}" alt="${d.name} preview" class="w-full h-48 object-cover">
        ${d.images.length > 1 ? `<button class='absolute top-2 left-2 bg-gray-700/70 text-white px-2 py-1 rounded prev'>&lt;</button>
        <button class='absolute top-2 right-2 bg-gray-700/70 text-white px-2 py-1 rounded next'>&gt;</button>` : ''}
      </div>
      <div class="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div class="flex items-center mb-2 gap-2">
            <img src="${d.logo}" alt="${d.name} logo" class="h-10 w-auto">
            <h3 class="text-lg font-bold text-primary"><a href="${d.marketplace_link}" target="_blank">${d.name}</a></h3>
          </div>
          <p class="text-softGray text-sm mb-2">${d.tagline || ''}</p>
          <p class="text-yellow-400 font-semibold mb-2">${d.price || ''}</p>
        </div>
        <a href="${d.marketplace_link}" target="_blank" class="mt-2 inline-block bg-accent text-gray-900 px-3 py-2 rounded hover:bg-yellow-400 transition text-center font-semibold">View Listing</a>
      </div>
    `;
    container.appendChild(card);

    if(d.images.length > 1){
      initSlider(card, d.images);
    }
  });
}

function initSlider(card, images){
  let current = 0;
  const imgEl = card.querySelector('img');
  const prevBtn = card.querySelector('.prev');
  const nextBtn = card.querySelector('.next');

  prevBtn.addEventListener('click',()=>{
    current = (current - 1 + images.length) % images.length;
    imgEl.src = images[current];
  });

  nextBtn.addEventListener('click',()=>{
    current = (current + 1) % images.length;
    imgEl.src = images[current];
  });
}

function renderPagination(){
  const totalPages = Math.ceil(domains.length / PAGE_SIZE);
  const container = document.getElementById('pagination');
  container.innerHTML = '';

  for(let i=1;i<=totalPages;i++){
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.className = `px-3 py-1 rounded ${i===currentPage?'bg-primary text-gray-900':'bg-gray-700 text-softGray'} hover:bg-primary hover:text-gray-900 transition`;
    btn.addEventListener('click',()=>{
      renderPage(i);
      renderPagination();
      window.scrollTo({top:0, behavior:'smooth'});
    });
    container.appendChild(btn);
  }
}

document.addEventListener('DOMContentLoaded', loadDomains);
