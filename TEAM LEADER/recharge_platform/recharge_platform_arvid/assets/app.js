const plans=[
 {id:1,operator:"Jio",price:199,validity:"23 days",category:"data",data:"1.5 GB/day",calls:"Unlimited calls",sms:"100 SMS/day",featured:false},
 {id:2,operator:"Airtel",price:299,validity:"28 days",category:"unlimited",data:"1.5 GB/day",calls:"Unlimited calls",sms:"100 SMS/day",featured:true},
 {id:3,operator:"Vi",price:349,validity:"28 days",category:"unlimited",data:"2 GB/day",calls:"Unlimited calls",sms:"100 SMS/day",featured:false},
 {id:4,operator:"Jio",price:599,validity:"84 days",category:"data",data:"1.5 GB/day",calls:"Unlimited calls",sms:"100 SMS/day",featured:true},
 {id:5,operator:"Airtel",price:799,validity:"84 days",category:"unlimited",data:"2.5 GB/day",calls:"Unlimited calls",sms:"100 SMS/day",featured:false},
 {id:6,operator:"BSNL",price:1499,validity:"365 days",category:"annual",data:"2 GB/day",calls:"Unlimited calls",sms:"100 SMS/day",featured:true}
];
let transactions=[
 {id:"ARV-98241",name:"Arvid's Mobile",service:"Jio",date:"Today, 10:18 AM",amount:299,status:"Success",icon:"📱"},
 {id:"ARV-98238",name:"TNEB Home",service:"Electricity",date:"Yesterday, 7:42 PM",amount:1240,status:"Success",icon:"⚡"},
 {id:"ARV-98212",name:"Dad's Mobile",service:"Airtel",date:"Oct 02, 9:14 AM",amount:599,status:"Success",icon:"📱"},
 {id:"ARV-98190",name:"JioFiber",service:"Broadband",date:"Sep 29, 8:30 PM",amount:899,status:"Pending",icon:"🌐"},
 {id:"ARV-98172",name:"Mom's Mobile",service:"Vi",date:"Sep 27, 6:21 PM",amount:249,status:"Failed",icon:"📱"},
 {id:"ARV-98110",name:"Arvid's Mobile",service:"Jio",date:"Sep 21, 11:10 AM",amount:199,status:"Success",icon:"📱"}
];
let contacts=[
 {name:"Arvid",number:"98765 43210",operator:"Jio",initial:"A"},
 {name:"Mom",number:"91234 56789",operator:"Airtel",initial:"M"},
 {name:"Dad",number:"99887 66554",operator:"Vi",initial:"D"},
 {name:"Home Internet",number:"90000 22001",operator:"JioFiber",initial:"H"}
];
let pendingRecharge=null, currentView="dashboard";

const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
function setView(view){
 currentView=view; location.hash=view;
 $$(".view").forEach(v=>v.classList.remove("active"));
 const el=$("#"+view+"View"); if(el) el.classList.add("active");
 $$(".nav-link").forEach(a=>a.classList.toggle("active",a.dataset.view===view));
 const names={dashboard:"Dashboard",recharge:"Recharge",plans:"Plans",transactions:"Transactions",wallet:"Wallet",bills:"Bill Payments",contacts:"Contacts",support:"Support"};
 $("#pageTitle").textContent=names[view]||"Dashboard";
 $("#sidebar").classList.remove("open"); window.scrollTo({top:0,behavior:"smooth"});
}
function initRoute(){const v=location.hash.replace("#",""); setView(["dashboard","recharge","plans","transactions","wallet","bills","contacts","support"].includes(v)?v:"dashboard")}
$$(".nav-link").forEach(a=>a.addEventListener("click",e=>{e.preventDefault();setView(a.dataset.view)}));
$("#openSidebar").onclick=()=>$("#sidebar").classList.add("open"); $("#closeSidebar").onclick=()=>$("#sidebar").classList.remove("open");
$("#themeBtn").onclick=()=>{document.body.classList.toggle("light");localStorage.setItem("arvidTheme",document.body.classList.contains("light")?"light":"dark");$("#themeBtn").textContent=document.body.classList.contains("light")?"☀":"☾"};
if(localStorage.getItem("arvidTheme")==="light"){$("body").classList.add("light");$("#themeBtn").textContent="☀"}
function showToast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove("show"),2800)}
function openModal(id){$("#"+id).classList.add("open")} function closeModal(id){$("#"+id).classList.remove("open")}
$$(".modal-backdrop").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)m.classList.remove("open")}));

function selectType(type){
 $$(".service-tab").forEach(x=>x.classList.toggle("active",x.dataset.type===type));
 const placeholders={mobile:"Enter 10-digit mobile number",dth:"Enter subscriber ID",broadband:"Enter account number"};
 $("#serviceNumber").placeholder=placeholders[type];
}
function applyAmount(n){$("#amount").value=n}
function renderRecent(){
 $("#recentList").innerHTML=transactions.slice(0,4).map(t=>`<div class="tx-item"><div class="tx-icon">${t.icon}</div><div class="tx-info"><b>${t.name}</b><small>${t.service} • ${t.date}</small></div><span class="amount">₹${t.amount}</span><span class="status ${t.status.toLowerCase()}">${t.status}</span></div>`).join("");
 $("#favoriteList").innerHTML=contacts.slice(0,4).map(c=>`<div class="favorite"><div class="avatar">${c.initial}</div><div><b>${c.name}</b><small>${c.number} • ${c.operator}</small></div><button onclick="quickContact('${c.number}','${c.operator}')">Recharge</button></div>`).join("");
}
function renderMiniPlans(){
 $("#miniPlans").innerHTML=plans.slice(0,4).map(p=>`<div class="mini-plan"><div class="plan-badge">₹</div><div><b>₹${p.price} • ${p.data}</b><small>${p.operator} • ${p.validity}</small></div><button onclick="usePlan(${p.price})">Use</button></div>`).join("");
}
function usePlan(price){setView("recharge");applyAmount(price);showToast("₹"+price+" plan selected")}
function quickContact(number,op){setView("recharge");$("#serviceNumber").value=number.replace(/\s/g,"");$("#operator").value=op==="JioFiber"?"Jio":op;showToast("Contact loaded into recharge form")}
$("#rechargeForm").addEventListener("submit",e=>{
 e.preventDefault(); const n=$("#serviceNumber").value.trim(), amount=Number($("#amount").value);
 if(n.length<8 || amount<10){showToast("Please enter valid service details");return}
 pendingRecharge={number:n,operator:$("#operator").value,amount}; 
 $("#paymentSummary").innerHTML=`<div><span>Service</span><b>${$("#operator").value} • ${n}</b></div><div><span>Recharge amount</span><b>₹${amount}</b></div><div><span>Fee</span><b>₹0</b></div><hr style="border:0;border-top:1px solid var(--border)"><div><span>Total</span><b style="font-size:18px">₹${amount}</b></div>`;
 openModal("paymentModal");
});
function completeRecharge(){
 if(!pendingRecharge)return;
 const t={id:"ARV-"+Math.floor(10000+Math.random()*89999),name:"Arvid's Mobile",service:pendingRecharge.operator,date:"Just now",amount:pendingRecharge.amount,status:"Success",icon:"📱"};
 transactions.unshift(t); closeModal("paymentModal");renderAll();showToast("✓ Recharge successful • ₹"+pendingRecharge.amount);pendingRecharge=null;
}
function renderPlans(filter="all"){
 const list=filter==="all"?plans:plans.filter(p=>p.category===filter);
 $("#plansGrid").innerHTML=list.map(p=>`<div class="plan-card ${p.featured?"featured":""}">${p.featured?'<span class="best">★ POPULAR</span>':""}<span class="eyebrow">${p.operator.toUpperCase()}</span><h3>${p.data}</h3><div class="price">₹${p.price}<small> / ${p.validity}</small></div><ul class="plan-features"><li>${p.calls}</li><li>${p.sms}</li><li>5G ready where available</li><li>Unlimited night data</li></ul><button class="primary-btn wide" onclick="usePlan(${p.price})">Recharge ₹${p.price}</button></div>`).join("");
}
$$(".filter-pills button").forEach(b=>b.onclick=()=>{$$(".filter-pills button").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderPlans(b.dataset.filter)});
function renderTransactions(){
 const q=($("#txSearch")?.value||"").toLowerCase(), f=$("#txFilter")?.value||"all";
 const list=transactions.filter(t=>(f==="all"||t.status===f)&&`${t.id} ${t.name} ${t.service}`.toLowerCase().includes(q));
 $("#txTable").innerHTML=list.map(t=>`<tr><td><b>${t.id}</b><small>${t.name}</small></td><td>${t.icon} ${t.service}</td><td>${t.date}</td><td><b>₹${t.amount}</b></td><td><span class="status ${t.status.toLowerCase()}">${t.status}</span></td><td><button class="table-action" onclick="showToast('Receipt ${t.id} ready')">Receipt</button></td></tr>`).join("")||`<tr><td colspan="6" style="text-align:center;padding:30px;color:var(--muted)">No transactions found</td></tr>`;
}
$("#txSearch").oninput=renderTransactions;$("#txFilter").onchange=renderTransactions;
function exportCSV(){const csv="ID,Name,Service,Date,Amount,Status\n"+transactions.map(t=>[t.id,t.name,t.service,t.date,t.amount,t.status].map(x=>`"${x}"`).join(",")).join("\n");const blob=new Blob([csv],{type:"text/csv"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="arvid-transactions.csv";a.click();URL.revokeObjectURL(url);showToast("CSV exported successfully")}
function setAdd(n){$("#addAmount").value=n}
function addMoney(){const n=Number($("#addAmount").value);if(n<100){showToast("Minimum wallet top-up is ₹100");return}closeModal("addMoneyModal");showToast("₹"+n.toLocaleString()+" added to wallet successfully")}
function openBill(type){$("#billTitle").textContent="Pay "+type+" bill";$("#billNumber").value="";$("#billAmount").value=type==="Electricity"?1240:type==="Credit Card"?3500:999;openModal("billModal")}
function payBill(){const n=$("#billNumber").value.trim(),a=Number($("#billAmount").value);if(!n){showToast("Enter your consumer/account number");return}transactions.unshift({id:"ARV-"+Math.floor(10000+Math.random()*89999),name:$("#billTitle").textContent.replace("Pay ",""),service:"Bill",date:"Just now",amount:a,status:"Success",icon:"▣"});closeModal("billModal");renderAll();showToast("✓ Bill payment successful • ₹"+a)}
function renderContacts(){$("#contactsGrid").innerHTML=contacts.map((c,i)=>`<div class="contact-card"><div class="contact-head"><div class="avatar">${c.initial}</div><div><b>${c.name}</b><small>${c.number}</small></div><button class="link-btn" onclick="removeContact(${i})">×</button></div><div class="contact-meta">Operator <b>${c.operator}</b> • Saved favorite</div><button onclick="quickContact('${c.number}','${c.operator}')">⚡ Recharge now</button></div>`).join("")}
function addContact(){const name=$("#contactName").value.trim(),number=$("#contactNumber").value.trim(),operator=$("#contactOperator").value;if(!name||number.length<8){showToast("Enter a valid name and number");return}contacts.push({name,number,operator,initial:name[0].toUpperCase()});closeModal("contactModal");renderAll();showToast("Contact saved to favorites")}
function removeContact(i){contacts.splice(i,1);renderAll();showToast("Contact removed")}
function toggleFaq(el){el.classList.toggle("open");el.querySelector("span").textContent=el.classList.contains("open")?"−":"+"}
$("#globalSearch").oninput=e=>{const q=e.target.value.toLowerCase();if(!q)return;const match=plans.find(p=>String(p.price).includes(q)||p.operator.toLowerCase().includes(q));if(match){setView("plans");showToast("Showing matching plans")}}
$("#helpSearch").oninput=e=>{const q=e.target.value.toLowerCase();$$(".faq-grid button").forEach(x=>x.style.display=x.innerText.toLowerCase().includes(q)?"block":"none")};
function renderAll(){renderRecent();renderMiniPlans();renderPlans();renderTransactions();renderContacts()}
initRoute();renderAll();
