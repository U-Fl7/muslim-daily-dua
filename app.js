const duaDataUrl = 'dua_data.json';
let duas = [];
let favs = JSON.parse(localStorage.getItem('muslim_dua_favs')||'[]');
let deferredPrompt = null;
async function loadData(){
  const res = await fetch(duaDataUrl);
  duas = await res.json();
  populateCategories();
  renderList();
}
function populateCategories(){
  const sel = document.getElementById('categoryFilter');
  const cats = ['all', ...Array.from(new Set(duas.map(d=>d.category))).sort()];
  sel.innerHTML = cats.map(c=>`<option value="${c}">${c[0].toUpperCase()+c.slice(1)}</option>`).join('');
  sel.addEventListener('change', renderList);
}
function renderList(){
  const q = document.getElementById('search').value.trim().toLowerCase();
  const cat = document.getElementById('categoryFilter').value;
  const container = document.getElementById('list');
  container.innerHTML = '';
  const filtered = duas.filter(d=>{
    if(cat!=='all' && d.category!==cat) return false;
    return [d.title, d.de, d.tr, d.ar].join(' ').toLowerCase().includes(q);
  });
  if(filtered.length===0){
    container.innerHTML = '<div style="grid-column:1/-1;padding:20px;text-align:center;color:var(--muted)">Keine Duas gefunden.</div>';
    return;
  }
  filtered.forEach(d=>{
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `<div class="titleRow"><h3>${d.title}</h3><div class="meta">${d.category}</div></div>
      <div class="ar">${d.ar}</div>
      <div class="tr">${d.tr}</div>
      <div class="de">${d.de}</div>
      <div class="btns">
        <button class="fav">${favs.includes(d.id)?'★ Favorit':'☆ Favorit'}</button>
        <button class="copy">Kopieren</button>
      </div>`;
    card.querySelector('.fav').onclick = ()=>{
      if(favs.includes(d.id)) favs = favs.filter(x=>x!==d.id);
      else favs.push(d.id);
      localStorage.setItem('muslim_dua_favs', JSON.stringify(favs));
      renderList();
    };
    card.querySelector('.copy').onclick = ()=>{
      navigator.clipboard.writeText(`${d.title}\n${d.ar}\n${d.tr}\n${d.de}`).then(()=>{
        alert('Dua kopiert');
      });
    };
    container.appendChild(card);
  });
}
document.getElementById('search').addEventListener('input', renderList);
document.getElementById('themeBtn').addEventListener('click', ()=>{
  document.body.classList.toggle('dark');
  localStorage.setItem('muslim_dua_theme', document.body.classList.contains('dark')?'dark':'light');
});
if(localStorage.getItem('muslim_dua_theme')==='dark') document.body.classList.add('dark');
window.addEventListener('beforeinstallprompt', (e)=>{
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById('installBtn').style.display = 'inline-block';
});
document.getElementById('installBtn').addEventListener('click', async ()=>{
  if(deferredPrompt){
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    deferredPrompt = null;
    document.getElementById('installBtn').style.display = 'none';
  } else {
    alert('Wenn du iPhone nutzt: öffne die Seite in Safari und benutze "Zum Home-Bildschirm" im Teilen-Menü.');
  }
});
document.getElementById('shareBtn').addEventListener('click', ()=>{
  const shareData = {title:'Muslim Daily Dua', text:'Muslim Daily Dua – nützliche Duas für den Alltag', url:location.href};
  if(navigator.share) navigator.share(shareData).catch(()=>alert('Teilen wurde abgebrochen'));
  else navigator.clipboard.writeText(location.href).then(()=>alert('Link kopiert'));
});
loadData();
