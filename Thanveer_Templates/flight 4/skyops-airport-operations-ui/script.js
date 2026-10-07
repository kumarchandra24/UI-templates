const flights = [
  {no:"6E 502", airline:"IndiGo", route:"MAA → DEL", time:"10:45", gate:"B12", aircraft:"A320neo", status:"Boarding"},
  {no:"AI 571", airline:"Air India", route:"MAA → BOM", time:"11:10", gate:"A07", aircraft:"A321", status:"On time"},
  {no:"SQ 528", airline:"Singapore", route:"SIN → MAA", time:"11:35", gate:"C04", aircraft:"A350", status:"On time"},
  {no:"EK 542", airline:"Emirates", route:"DXB → MAA", time:"12:05", gate:"C09", aircraft:"B777", status:"Delayed"},
  {no:"UK 821", airline:"Vistara", route:"MAA → BLR", time:"12:25", gate:"A11", aircraft:"A320", status:"On time"},
  {no:"6E 633", airline:"IndiGo", route:"HYD → MAA", time:"12:40", gate:"B04", aircraft:"A321neo", status:"Landed"},
  {no:"QR 528", airline:"Qatar", route:"DOH → MAA", time:"13:15", gate:"C02", aircraft:"B787", status:"On time"},
  {no:"LH 758", airline:"Lufthansa", route:"FRA → MAA", time:"14:20", gate:"C07", aircraft:"A340", status:"On time"}
];

const gates = [
 ["A01","Available","—"],["A02","Occupied","AI 571"],["A03","Available","—"],["A04","Maintenance","Electrical"],
 ["A05","Occupied","UK 821"],["A06","Available","—"],["A07","Occupied","AI 571"],["A08","Occupied","6E 411"],
 ["B01","Available","—"],["B02","Occupied","6E 502"],["B03","Available","—"],["B04","Occupied","6E 633"],
 ["B05","Occupied","6E 921"],["B06","Available","—"],["B07","Maintenance","Jet bridge"],["B08","Occupied","6E 741"]
];

const alerts = [
 {title:"Gate B07 unavailable",desc:"Jet bridge hydraulic inspection in progress.",time:"8 min ago",level:"critical"},
 {title:"EK 542 delay",desc:"Inbound aircraft delayed by 22 minutes.",time:"14 min ago",level:"warning"},
 {title:"Baggage belt 04",desc:"Sensor reading above normal temperature.",time:"21 min ago",level:"warning"}
];

const incidents = [
 {title:"Gate B07 unavailable",desc:"Jet bridge hydraulic inspection · Gate B07 · Assigned to Engineering",level:"critical",time:"09:41"},
 {title:"EK 542 arrival delay",desc:"Inbound delay of 22 minutes · Passenger impact: medium",level:"medium",time:"09:35"},
 {title:"Baggage belt 04 sensor",desc:"Temperature alert · Monitoring remotely",level:"medium",time:"09:28"}
];

const turnarounds = [
 ["6E 502","Gate B12","78%",["Catering","Fuel","Baggage","Cleaning"],"10:45"],
 ["AI 571","Gate A07","54%",["Catering","Fuel","Baggage"],"11:10"],
 ["UK 821","Gate A11","92%",["Catering","Fuel","Baggage","Cleaning"],"12:25"],
 ["6E 633","Gate B04","36%",["Baggage","Cleaning"],"12:40"]
];

const team = [
 ["TD","Mr. Tyler Durden","Operations Lead","Shift command · Terminal 1"],
 ["AK","Ananya Kapoor","Airside Coordinator","Gate allocation · Stands"],
 ["RM","Rahul Menon","Ground Handling","Turnaround coordination"],
 ["SP","Sofia Patel","Safety Officer","Incident management"],
 ["JN","James Nolan","Duty Engineer","Facilities · Jet bridges"],
 ["LM","Lina Mathews","Passenger Services","Boarding · Disruption care"]
];

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function showToast(message){
  const t=$("#toast"); t.textContent=message; t.classList.add("show");
  clearTimeout(window.toastTimer); window.toastTimer=setTimeout(()=>t.classList.remove("show"),2800);
}
function statusClass(s){ return s.toLowerCase().replace(/\s+/g,"-"); }
function renderFlights(target, compact=false){
  const rows=flights.map(f=>`<tr><td class="flight-no">${f.no}</td>${compact?"":`<td>${f.airline}</td>`}<td class="route">${f.route}</td><td>${f.time}</td><td>${f.gate}</td><td>${f.aircraft}</td><td><span class="status ${statusClass(f.status)}">${f.status}</span></td></tr>`).join("");
  $(target).innerHTML=rows;
}
function renderAlerts(){
  $("#alertPreview").innerHTML=alerts.map(a=>`<div class="alert-item"><div class="alert-icon ${a.level==="warning"?"amber":""}">${a.level==="critical"?"!":"⚠"}</div><div><strong>${a.title}</strong><p>${a.desc}</p><span class="alert-time">${a.time}</span></div></div>`).join("");
}
function renderGates(){
  $("#gateGrid").innerHTML=gates.map(g=>`<article class="gate-card"><div class="gate-top"><span class="gate-no">${g[0]}</span><span class="gate-state ${g[1].toLowerCase()}">${g[1]}</span></div><p>${g[1]==="Occupied"?"Flight":"Note"}</p><strong>${g[2]}</strong></article>`).join("");
}
function renderTurnarounds(){
  $("#turnGrid").innerHTML=turnarounds.map(t=>`<article class="turn-card"><div class="turn-head"><strong>${t[0]}</strong><span>${t[1]} · ETD ${t[4]}</span></div><div class="progress"><i style="width:${t[2]}"></i></div><div class="turn-meta"><span>${t[2]} complete</span><span>Turnaround</span></div><div class="checklist">${t[3].map((x,i)=>`<span class="check ${i < Math.ceil(t[3].length*.65)?"done":"pending"}">${x}</span>`).join("")}</div></article>`).join("");
}
function renderIncidents(){
  $("#incidentList").innerHTML=incidents.map((x,i)=>`<article class="incident ${x.level==="medium"?"medium":""} ${x.level==="low"?"low":""}"><div class="priority"></div><div class="incident-main"><strong>${x.title}</strong><p>${x.desc}</p><small class="alert-time">Reported ${x.time}</small></div><div class="incident-actions"><button class="filter-btn" onclick="resolveIncident(${i})">Resolve</button></div></article>`).join("");
}
function renderTeam(){
  $("#teamGrid").innerHTML=team.map(x=>`<article class="team-card"><div class="avatar">${x[0]}</div><strong>${x[1]}</strong><span>${x[2]}</span><p>${x[3]}</p></article>`).join("");
}
function resolveIncident(i){ const item=incidents.splice(i,1)[0]; $("#incidentMetric").textContent=incidents.length; renderIncidents(); showToast(`Incident resolved: ${item.title}`); }
function switchView(view){
  $$(".view").forEach(v=>v.classList.remove("active")); $(`#${view}`).classList.add("active");
  $$(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.view===view));
  const labels={overview:"Operations Overview",flights:"Flight Board",gates:"Gates & Stands",turnaround:"Turnaround Control",alerts:"Alerts & Incidents",team:"Operations Team",reports:"Operations Reports",settings:"Settings"};
  $("#pageTitle").textContent=labels[view];
  if(innerWidth<761) $("#sidebar").classList.remove("open");
}
$$(".nav-item").forEach(b=>b.addEventListener("click",()=>switchView(b.dataset.view)));
$$("[data-view-link]").forEach(b=>b.addEventListener("click",()=>switchView(b.dataset.viewLink)));
$("#menuBtn").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
$("#notifyBtn").addEventListener("click",()=>{switchView("alerts");showToast("Showing 3 operational alerts");});
$("#profileBtn").addEventListener("click",()=>showToast("Signed in as Mr. Tyler Durden · Operations Lead"));
$("#refreshFlights").addEventListener("click",()=>{renderFlights("#flightPreview",true);showToast("Flight board refreshed");});
$("#autoAssignBtn").addEventListener("click",()=>{
  const g=gates.find(x=>x[1]==="Available");
  if(g){g[1]="Occupied";g[2]="AUTO-ASSIGNED";renderGates();showToast(`${g[0]} automatically assigned to next priority flight`);}
  else showToast("No available stands at this time");
});
$("#exportBtn").addEventListener("click",()=>{
  const data="SkyOps Operations Report\\nGenerated for Mr. Tyler Durden\\n\\nDeparture punctuality: 94.2%\\nAverage turnaround: 42 min\\nGate utilization: 84.3%\\nBaggage SLA: 97.1%";
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([data],{type:"text/plain"}));a.download="skyops-operations-report.txt";a.click();showToast("Report exported");
});
function incidentModal(){
  $("#modalContent").innerHTML=`<h3>Log an incident</h3><p>Create a live operational incident for the duty team.</p>
  <div class="form-row"><label>Incident title</label><input id="incidentTitle" placeholder="e.g. Gate equipment fault"></div>
  <div class="form-row"><label>Priority</label><select id="incidentPriority"><option>Critical</option><option>Medium</option><option>Low</option></select></div>
  <div class="form-row"><label>Location / details</label><input id="incidentDetails" placeholder="Gate, stand, terminal or operational details"></div>
  <div class="modal-actions"><button class="filter-btn" id="cancelModal">Cancel</button><button class="primary-btn" id="saveIncident">Create incident</button></div>`;
  $("#modal").classList.add("show");
  $("#cancelModal").onclick=()=>$("#modal").classList.remove("show");
  $("#saveIncident").onclick=()=>{
    const title=$("#incidentTitle").value.trim()||"Untitled operational incident";
    const detail=$("#incidentDetails").value.trim()||"No additional details provided";
    const level=$("#incidentPriority").value.toLowerCase();
    incidents.unshift({title,desc:detail,level,time:new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})});
    $("#incidentMetric").textContent=incidents.length;renderIncidents();$("#modal").classList.remove("show");switchView("alerts");showToast("Incident created and assigned to duty team");
  };
}
$("#newIncidentBtn").onclick=incidentModal;$("#newIncidentBtn2").onclick=incidentModal;$("#modalClose").onclick=()=>$("#modal").classList.remove("show");
$("#modal").addEventListener("click",e=>{if(e.target.id==="modal")$("#modal").classList.remove("show")});
$("#addFlightBtn").onclick=()=>showToast("Flight creation workflow opened — connect this action to your API in production");
$("#flightSearch").addEventListener("input",filterFlights);$("#statusFilter").addEventListener("change",filterFlights);
function filterFlights(){const q=$("#flightSearch").value.toLowerCase(),s=$("#statusFilter").value;$("#flightTable").innerHTML=flights.filter(f=>(`${f.no} ${f.airline} ${f.route}`.toLowerCase().includes(q))&&(s==="all"||f.status===s)).map(f=>`<tr><td class="flight-no">${f.no}</td><td>${f.airline}</td><td class="route">${f.route}</td><td>${f.time}</td><td>${f.gate}</td><td>${f.aircraft}</td><td><span class="status ${statusClass(f.status)}">${f.status}</span></td></tr>`).join("")}
function tick(){ $("#clock").textContent=new Date().toLocaleTimeString("en-IN",{hour12:false});}
setInterval(tick,1000);tick();
renderFlights("#flightPreview",true);renderFlights("#flightTable");renderAlerts();renderGates();renderTurnarounds();renderIncidents();renderTeam();
