const sources=[
{name:'Water Point #27',type:'point',lat:9.5602,lng:44.0647,status:'available',price:'$1.20',distance:'0.8 km',note:'Updated 8 min ago'},
{name:'Hargeisa Community Tank',type:'point',lat:9.5658,lng:44.0732,status:'available',price:'$1.00',distance:'1.1 km',note:'Updated 12 min ago'},
{name:'Ahmed Water Services',type:'truck',lat:9.5531,lng:44.0679,status:'available',price:'$1.50',distance:'1.4 km',note:'Delivery available'},
{name:'26 June Tank',type:'point',lat:9.575,lng:44.051,status:'low',price:'$1.35',distance:'2.0 km',note:'Low supply · update 19 min ago'},
{name:'North District Point',type:'point',lat:9.584,lng:44.081,status:'empty',price:'—',distance:'2.7 km',note:'Reported empty 6 min ago'}
];
const statusText={available:'AVAILABLE',low:'LOW SUPPLY',empty:'EMPTY'};
let map,markers=[];
function iconFor(s){return s==='available'?'💧':s==='low'?'⚠':'×'}
function markerIcon(s){return L.divIcon({className:'haga-marker',html:`<span style="display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:white;border:3px solid ${s==='available'?'#25c7a1':s==='low'?'#f2ad43':'#e85d6a'};box-shadow:0 8px 18px rgba(7,27,47,.18);font-size:12px;font-weight:800;color:#071b2f">${iconFor(s)}</span>`,iconSize:[34,34],iconAnchor:[17,17]})}
function renderSources(filter='all'){
 const list=document.getElementById('sourceCards'); const data=filter==='all'?sources:sources.filter(s=>s.status===filter); document.getElementById('sourceCount').textContent=data.length; list.innerHTML=data.map((s,i)=>`<article class="source-card" data-index="${sources.indexOf(s)}"><div class="source-row"><div class="source-icon">${s.type==='truck'?'🚛':'💧'}</div><div class="source-main"><strong>${s.name}</strong><small>${s.distance} · ${s.note}</small></div><span class="source-price">${s.price}</span></div><div class="source-status ${s.status}">● ${statusText[s.status]}</div></article>`).join(''); list.querySelectorAll('.source-card').forEach(c=>c.addEventListener('click',()=>{const s=sources[+c.dataset.index];map.setView([s.lat,s.lng],15,{animate:true});markers.find(m=>m._hagaName===s.name)?.openPopup()}));}
function initMap(){
 map=L.map('map',{zoomControl:false,scrollWheelZoom:false}).setView([9.563,44.068],13);
 L.control.zoom({position:'bottomright'}).addTo(map);
 L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{attribution:'&copy; OpenStreetMap &copy; CARTO',maxZoom:19}).addTo(map);
 sources.forEach(s=>{const m=L.marker([s.lat,s.lng],{icon:markerIcon(s.status)}).addTo(map).bindPopup(`<div style="font-family:DM Sans,sans-serif;min-width:150px"><b>${s.name}</b><br><span style="font-size:11px;color:#6d7b8c">${s.distance} · ${s.note}</span><br><strong style="display:inline-block;margin-top:6px">${s.price}</strong></div>`);m._hagaName=s.name;markers.push(m)});
}
document.querySelectorAll('.map-filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.map-filter').forEach(x=>x.classList.remove('active'));btn.classList.add('active');renderSources(btn.dataset.filter)}));
function modal(open){const el=document.getElementById('reportModal');el.classList.toggle('open',open);el.setAttribute('aria-hidden',String(!open));if(!open){document.getElementById('reportForm').style.display='grid';document.getElementById('successState').style.display='none';}}
document.querySelectorAll('[data-open-report]').forEach(b=>b.addEventListener('click',()=>modal(true)));document.querySelectorAll('[data-close-report]').forEach(b=>b.addEventListener('click',()=>modal(false)));document.getElementById('reportModal').addEventListener('click',e=>{if(e.target.id==='reportModal')modal(false)});document.addEventListener('keydown',e=>{if(e.key==='Escape')modal(false)});
document.getElementById('reportForm').addEventListener('submit',e=>{e.preventDefault();const report={problem:document.getElementById('problem').value,area:document.getElementById('area').value,details:document.getElementById('details').value,time:new Date().toISOString()};const old=JSON.parse(localStorage.getItem('hagaReports')||'[]');localStorage.setItem('hagaReports',JSON.stringify([report,...old]));e.target.style.display='none';document.getElementById('successState').style.display='block'});
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.1});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
renderSources();initMap();
