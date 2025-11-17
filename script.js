async function loadData(){
  const res = await fetch('duas.json');
  const data = await res.json();
  window.appData = data;
  renderCategories(data);
  renderList('all');
}
function renderCategories(data){
  const cats = data.categories;
  const cwrap = document.getElementById('categories');
  cwrap.innerHTML='';
  const allBtn = document.createElement('button');
  allBtn.innerHTML = '📚 Alle';
  allBtn.onclick = ()=>renderList('all');
  cwrap.appendChild(allBtn);
  cats.forEach(c=>{
    const btn = document.createElement('button');
    btn.innerHTML = `${c.icon} ${c.title}`;
    btn.onclick = ()=>renderList(c.key);
    cwrap.appendChild(btn);
  });
}
function renderList(category){
  const list = document.getElementById('list');
  list.innerHTML='';
  const data = window.appData;
  let groups = [];
  if(category==='all'){
    groups = data.propheten;
  } else if(category==='dhikr'){
    groups = data.dhikr_groups;
  } else {
    groups = data.propheten.filter(p=>p.category===category);
  }
  groups.forEach(g=>{
    const card = document.createElement('div');
    card.className='card';
    const title = document.createElement('div');
    title.innerHTML = `<strong>${g.name}</strong>`;
    card.appendChild(title);
    const btn = document.createElement('button');
    btn.textContent = 'Anzeigen / Verbergen';
    card.appendChild(btn);
    const panel = document.createElement('div');
    panel.className='panel';
    if(g.duas){
      g.duas.forEach(d=>{
        const dbox = document.createElement('div');
        dbox.style.marginTop='10px';
        dbox.innerHTML = `<div><b>Kontext:</b> ${d.context}</div>
          <div class="ar">${d.arabic}</div>
          <div class="trans">${d.transliteration}</div>
          <div>${d.deutsch}</div>
          <div class="source"><b>Quelle:</b> ${d.source}</div>`;
        panel.appendChild(dbox);
      });
    } else {
      panel.innerHTML = '<div>Keine Einträge.</div>';
    }
    btn.onclick = ()=> panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
    card.appendChild(panel);
    list.appendChild(card);
  });
}
document.getElementById && loadData();
document.getElementById('themeBtn') && document.getElementById('themeBtn').addEventListener('click', ()=>{
  document.body.classList.toggle('dark');
  localStorage.setItem('muslim_dua_theme', document.body.classList.contains('dark')?'dark':'light');
});
if(localStorage.getItem('muslim_dua_theme')==='dark') document.body.classList.add('dark');
