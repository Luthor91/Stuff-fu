// js/main.js
import { BUILD_DATA, CLASS_LIST } from './dataModel/build.js';

// --- Options de coût ---
const COST_OPTIONS = [
  { key: 'all',      label: 'Tous les coûts' },
  { key: 'low cost', label: 'Low cost' },
  { key: 'mid cost', label: 'Mid cost' },
  { key: 'opti',     label: 'Opti' },
  { key: 'parfait',  label: 'Parfait' },
];

// État UI (utiliser "cost" — sans 's')
const state = {
  q: '',
  cost: 'all',
  klass: 'all',
};

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const elSearch        = document.getElementById('search');
  const elCostSelect    = document.getElementById('costFilter'); 
  const elClassFilter   = document.getElementById('classFilter');
  const elCards         = document.getElementById('cards');
  const elEmpty         = document.getElementById('empty');
  const elCount         = document.getElementById('count');
  const elActiveFilters = document.getElementById('activeFilters');

  // Sécurité: si un élément manque, on log + on stoppe proprement
  if (!elSearch || !elCostSelect || !elClassFilter || !elCards || !elEmpty || !elCount || !elActiveFilters) {
    console.error('[Builds] Un ou plusieurs éléments #id sont introuvables dans le DOM.');
    return;
  }

  // Init
  initCostSelect(elCostSelect);
  initClassSelect(elClassFilter);
  attachEvents();
  render();

  // ====== UI Setup ======
  function initCostSelect(selectEl){
    selectEl.innerHTML = '';
    COST_OPTIONS.forEach(({key, label})=>{
      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = label;
      selectEl.appendChild(opt);
    });
    // Valeur par défaut
    selectEl.value = state.cost;
  }

  function initClassSelect(selectEl){
    selectEl.innerHTML = '';
    const optAll = document.createElement('option');
    optAll.value = 'all';
    optAll.textContent = 'Toutes les classes';
    selectEl.appendChild(optAll);

    // Liste FR fournie par ton dataModel
    (CLASS_LIST?.fr ?? []).forEach(c=>{
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      selectEl.appendChild(opt);
    });

    // Valeur par défaut
    selectEl.value = state.klass;
  }

  function attachEvents(){
    // Recherche avec debounce
    let t;
    elSearch.addEventListener('input', (e)=>{
      clearTimeout(t);
      t = setTimeout(()=>{
        state.q = (e.target.value || '').trim().toLowerCase();
        render();
      }, 120);
    });

    elClassFilter.addEventListener('change', (e)=>{
      state.klass = e.target.value;
      render();
    });

    elCostSelect.addEventListener('change', (e)=>{
      state.cost = e.target.value;       // <-- utiliser "cost"
      render();
    });
  }

  // ====== Data filtering & render ======
  function getFiltered(){
    const entries = Object.entries(BUILD_DATA);

    return entries.filter(([key, obj])=>{
      // 1) Recherche par nom
      if (state.q && !key.toLowerCase().includes(state.q)) return false;

      // 2) Classe
      if (state.klass !== 'all' && obj.class !== state.klass) return false;

      // 3) Coût (simple select)
      if (state.cost !== 'all') {
        const kws = (obj.keywords || []).map(s => String(s).toLowerCase());
        if (!kws.includes(state.cost)) return false;
      }

      return true;
    });
  }

  function render(){
    const filtered = getFiltered();
    elCards.innerHTML = '';

    if (filtered.length === 0){
      elEmpty.hidden = false;
      elCount.textContent = '0';
      elActiveFilters.textContent = activeFiltersText();
      return;
    }

    elEmpty.hidden = true;
    elCount.textContent = String(filtered.length);
    elActiveFilters.textContent = activeFiltersText();

    for (const [buildKey, build] of filtered){
      elCards.appendChild(renderCard(buildKey, build));
    }
  }

  function renderCard(buildKey, build){
    const card = document.createElement('article');
    card.className = 'card';

    const thumb = document.createElement('div');
    thumb.className = 'thumb';
    const img = document.createElement('img');
    img.alt = `Illustration du build ${buildKey}`;
    img.src = build.image || '';
    img.onerror = () => {
      img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="640" height="360">
          <rect width="100%" height="100%" fill="#0c1118"/>
          <text x="50%" y="50%" fill="#2b3442" font-size="20" text-anchor="middle" dominant-baseline="middle">
            Image introuvable
          </text>
        </svg>
      `);
    };
    thumb.appendChild(img);

    const content = document.createElement('div');
    content.className = 'content';

    const titleRow = document.createElement('div');
    titleRow.className = 'title-row';

    const h3 = document.createElement('h3');
    h3.className = 'title';
    h3.textContent = buildKey;

    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = build.class || 'Classe ?';

    titleRow.appendChild(h3);
    titleRow.appendChild(badge);

    const desc = document.createElement('p');
    desc.className = 'desc';
    desc.textContent = build.description || '';

    const tags = document.createElement('div');
    tags.className = 'tags';
    (build.keywords || []).forEach(k=>{
      const t = document.createElement('span');
      t.className = 'tag';
      t.textContent = k;
      tags.appendChild(t);
    });

    const actions = document.createElement('div');
    actions.className = 'actions';
    const link = document.createElement('a');
    link.className = 'btn';
    link.href = build.url || '#';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Voir le build';
    actions.appendChild(link);

    content.appendChild(titleRow);
    content.appendChild(desc);
    if (build.keywords?.length) content.appendChild(tags);
    content.appendChild(actions);

    card.appendChild(thumb);
    card.appendChild(content);
    return card;
  }

  function activeFiltersText(){
    const bits = [];
    if (state.q) bits.push(`recherche: “${state.q}”`);
    if (state.klass !== 'all') bits.push(`classe: ${state.klass}`);
    if (state.cost !== 'all') bits.push(`coût: ${state.cost}`);
    return bits.length ? bits.join(' · ') : '';
  }
});
