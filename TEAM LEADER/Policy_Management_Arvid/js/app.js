const state = {
  policies: [
    {id:1,name:"Information Security Policy",cat:"Security",owner:"Arvid",status:"Active",review:"Nov 12",version:"v4.2",desc:"Protect organizational information, systems and digital assets."},
    {id:2,name:"Acceptable Use Policy",cat:"Security",owner:"Priya Menon",status:"In Review",review:"Today",version:"v2.8",desc:"Defines responsible use of company technology and resources."},
    {id:3,name:"Remote Work Policy",cat:"HR",owner:"Daniel Chen",status:"Active",review:"Dec 03",version:"v3.1",desc:"Guidelines for secure, productive flexible working arrangements."},
    {id:4,name:"Data Privacy Policy",cat:"Privacy",owner:"Arvid",status:"Active",review:"Oct 28",version:"v5.0",desc:"Privacy principles and responsibilities for personal data."},
    {id:5,name:"Expense & Travel Policy",cat:"Finance",owner:"Priya Menon",status:"Draft",review:"—",version:"v1.0",desc:"Rules for business expenses, travel and reimbursements."},
    {id:6,name:"Business Continuity Policy",cat:"Operations",owner:"Daniel Chen",status:"Active",review:"Jan 16",version:"v2.3",desc:"Resilience requirements for critical business processes."},
    {id:7,name:"Password & Authentication",cat:"Security",owner:"Arvid",status:"Active",review:"Nov 08",version:"v4.0",desc:"Minimum authentication and credential management standards."},
    {id:8,name:"Employee Conduct Policy",cat:"HR",owner:"Priya Menon",status:"In Review",review:"Today",version:"v3.7",desc:"Expected professional conduct and workplace standards."},
    {id:9,name:"Vendor Risk Management",cat:"Operations",owner:"Daniel Chen",status:"Active",review:"Feb 02",version:"v2.1",desc:"Risk assessment requirements for third-party vendors."},
    {id:10,name:"Financial Controls Policy",cat:"Finance",owner:"Arvid",status:"Active",review:"Nov 30",version:"v6.1",desc:"Financial control framework and approval requirements."},
    {id:11,name:"Data Retention Policy",cat:"Privacy",owner:"Priya Menon",status:"Archived",review:"—",version:"v2.0",desc:"Retention periods and secure disposal requirements."},
    {id:12,name:"Incident Response Policy",cat:"Security",owner:"Arvid",status:"Active",review:"Oct 19",version:"v3.9",desc:"Structured response process for security incidents."}
  ],
  activities: [
    ["A","Arvid","published","Information Security Policy","8 min ago"],
    ["PM","Priya Menon","submitted","Employee Conduct Policy for review","32 min ago"],
    ["DC","Daniel Chen","approved","Vendor Risk Management","1 hr ago"],
    ["A","Arvid","updated","Data Privacy Policy v5.0","2 hrs ago"],
    ["RK","Ravi Kumar","acknowledged","Acceptable Use Policy","3 hrs ago"]
  ],
  approvals: [
    ["Acceptable Use Policy","Priya Menon","Arvid","Today","Medium"],
    ["Employee Conduct Policy","Priya Menon","Arvid","Today","Low"],
    ["Access Control Standard","Ravi Kumar","Priya Menon","Oct 04","High"],
    ["AI Usage Guidelines","Arvid","Daniel Chen","Oct 03","Medium"],
    ["Vendor Security Addendum","Daniel Chen","Arvid","Oct 02","High"]
  ],
  domains:[["Access Management",98],["Data Protection",96],["Security Operations",94],["Privacy",92],["Business Continuity",90],["Third-Party Risk",88]],
  exceptions:[["Privileged access review","High","Due Oct 08"],["Vendor evidence refresh","Medium","Due Oct 12"],["Legacy account cleanup","Low","Due Oct 19"],["Backup recovery test","Medium","Due Oct 24"]],
  departments:[
    ["IT & Security","⌁","8 policies","98%","Arvid"],["Human Resources","♙","5 policies","94%","Priya Menon"],["Finance","◈","4 policies","97%","Arvid"],["Operations","◫","4 policies","91%","Daniel Chen"],["Legal & Privacy","§","3 policies","93%","Priya Menon"],["Executive","◆","2 policies","100%","Arvid"]
  ],
  people:[
    ["Arvid Sawmi","AS","Administrator","24 policies"],["Priya Menon","PM","Policy Owner","7 policies"],["Daniel Chen","DC","Reviewer","5 policies"],["Ravi Kumar","RK","Reviewer","4 policies"],["Meera Shah","MS","Viewer","2 policies"],["Nisha Rao","NR","Policy Owner","3 policies"]
  ],
  documents:[
    ["ISO 27001 Certificate","Certificate","2.4 MB","Oct 02"],["SOC 2 Type II Report","Evidence","8.1 MB","Sep 28"],["Security Risk Assessment 2026","Evidence","1.8 MB","Sep 24"],["Data Processing Register","Reference","540 KB","Sep 20"],["BCP Test Results","Evidence","3.2 MB","Sep 16"]
  ],
  notifications:[
    ["◷","Policy review due today","Acceptable Use Policy requires your review.","8 min ago",true],
    ["✓","Approval completed","Daniel Chen approved Vendor Risk Management.","1 hr ago",true],
    ["△","Control gap detected","Privileged access review is overdue.","2 hrs ago",true],
    ["◈","New policy submitted","Employee Conduct Policy is ready for review.","3 hrs ago",false],
    ["▤","Policy acknowledged","Ravi Kumar acknowledged Acceptable Use Policy.","Yesterday",false]
  ]
};

function $(id){return document.getElementById(id)}
function showToast(text,title="Success"){
  $("toastTitle").textContent=title;$("toastText").textContent=text;
  $("toast").classList.add("show");clearTimeout(window.toastTimer);
  window.toastTimer=setTimeout(()=>$("toast").classList.remove("show"),2800);
}
function openModal(id){$(id).classList.add("open")}
function closeModal(id){$(id).classList.remove("open")}
document.querySelectorAll(".modal-backdrop").forEach(b=>b.addEventListener("click",e=>{if(e.target===b)b.classList.remove("open")}));

function navigate(page){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active-page"));
  $("page-"+page).classList.add("active-page");
  document.querySelectorAll(".nav-item").forEach(n=>n.classList.toggle("active",n.dataset.page===page));
  const labels={dashboard:"Overview",policies:"Policies",approvals:"Approvals",compliance:"Compliance",audits:"Audit Trail",departments:"Departments",people:"People & Roles",documents:"Documents",reports:"Reports",notifications:"Notifications",settings:"Settings"};
  $("breadcrumb").textContent=labels[page]||page;
  window.scrollTo({top:0,behavior:"smooth"});
  if(page==="dashboard")drawChart();
}
document.querySelectorAll(".nav-item").forEach(n=>n.addEventListener("click",()=>navigate(n.dataset.page)));
$("mobileMenu").addEventListener("click",()=>$("sidebar").classList.toggle("open"));
$("themeBtn").addEventListener("click",()=>{document.body.classList.toggle("light");localStorage.setItem("policyTheme",document.body.classList.contains("light")?"light":"dark");showToast("Theme updated.")});
if(localStorage.getItem("policyTheme")==="light")document.body.classList.add("light");

function policyCard(p){
  const icon={Security:"◈",HR:"♙",Finance:"◆",Operations:"◫",Privacy:"⌁"}[p.cat]||"▤";
  return `<article class="policy-card"><div class="policy-card-head"><div class="policy-icon">${icon}</div><span class="status ${p.status.toLowerCase().replaceAll(" ","-")}">${p.status}</span></div><h3>${p.name}</h3><p>${p.desc}</p><div class="policy-meta"><span class="policy-owner"><span class="tiny-avatar">${p.owner.split(" ").map(x=>x[0]).join("").slice(0,2)}</span>${p.owner}</span><span>Review ${p.review}</span></div><button class="policy-menu" onclick="policyAction(${p.id})">•••</button></article>`
}
function renderPolicies(){
  const q=($("policySearch")?.value||"").toLowerCase(), st=$("statusFilter")?.value||"all", cat=$("categoryFilter")?.value||"all";
  const arr=state.policies.filter(p=>(!q||p.name.toLowerCase().includes(q)||p.owner.toLowerCase().includes(q))&&(st==="all"||p.status===st)&&(cat==="all"||p.cat===cat));
  $("policyGrid").innerHTML=arr.map(policyCard).join("");
  $("visiblePolicyCount").textContent=arr.length;
  $("policyNavCount").textContent=state.policies.length;
  $("kpiPolicies").textContent=state.policies.filter(p=>p.status==="Active").length;
}
function policyAction(id){
  const p=state.policies.find(x=>x.id===id);
  showToast(`${p.name} selected. Version ${p.version}.`,"Policy Details");
}
["policySearch","statusFilter","categoryFilter"].forEach(id=>$(id)?.addEventListener("input",renderPolicies));
function resetPolicyFilters(){ $("policySearch").value="";$("statusFilter").value="all";$("categoryFilter").value="all";renderPolicies();showToast("Policy filters reset.") }

function renderActivities(){
  $("activityList").innerHTML=state.activities.map(a=>`<div class="activity"><div class="activity-avatar">${a[0]}</div><div><strong>${a[1]} <span style="color:#6f857c;font-weight:400">${a[2]}</span></strong><p>${a[3]}</p></div><time>${a[4]}</time></div>`).join("");
}
function renderAttention(){
  $("attentionList").innerHTML=[["◷","Policy review due","Acceptable Use Policy · Today","warn"],["△","Control gap","Privileged access review","red"],["✓","Approval waiting","Employee Conduct Policy",""],["◈","Evidence expiring","ISO 27001 Certificate · 28 days",""]].map(x=>`<div class="attention"><div class="attention-icon ${x[3]}">${x[0]}</div><div><strong>${x[1]}</strong><small>${x[2]}</small></div><button onclick="showToast('Opening ${x[1].replaceAll("'","")}')">Open →</button></div>`).join("");
}
function drawChart(){
  const c=$("healthChart");if(!c)return;const ctx=c.getContext("2d"),dpr=devicePixelRatio||1,w=c.clientWidth,h=250;c.width=w*dpr;c.height=h*dpr;ctx.scale(dpr,dpr);
  ctx.clearRect(0,0,w,h);const pad={l:12,r:8,t:15,b:25},vals=[82,85,84,89,92,94.8],cov=[76,80,83,86,90,93],max=100;
  ctx.strokeStyle="rgba(255,255,255,.07)";ctx.lineWidth=1;for(let i=0;i<5;i++){let y=pad.t+i*(h-pad.t-pad.b)/4;ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(w-pad.r,y);ctx.stroke()}
  function line(data,stroke){ctx.beginPath();data.forEach((v,i)=>{let x=pad.l+i*(w-pad.l-pad.r)/(data.length-1),y=pad.t+(max-v)*(h-pad.t-pad.b)/max;i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke();data.forEach((v,i)=>{let x=pad.l+i*(w-pad.l-pad.r)/(data.length-1),y=pad.t+(max-v)*(h-pad.t-pad.b)/max;ctx.beginPath();ctx.arc(x,y,3,0,Math.PI*2);ctx.fillStyle=stroke;ctx.fill()})}
  line(vals,"#9a7cff");line(cov,"#31d9b1");ctx.fillStyle="#667d74";ctx.font="9px DM Sans";["May","Jun","Jul","Aug","Sep","Oct"].forEach((m,i)=>ctx.fillText(m,pad.l+i*(w-pad.l-pad.r)/5,h-7));
}
window.addEventListener("resize",drawChart);

function renderApprovals(){
 $("approvalTable").innerHTML=state.approvals.map((a,i)=>`<tr><td><strong>${a[0]}</strong></td><td>${a[1]}</td><td>${a[2]}</td><td>${a[3]}</td><td><span class="risk ${a[4].toLowerCase()}">${a[4]}</span></td><td><button class="table-action" onclick="approve(${i})">Review</button></td></tr>`).join("");
 $("pendingCount").textContent=state.approvals.length;$("kpiReviews").textContent=state.approvals.length;
}
function approve(i){const item=state.approvals[i];state.approvals.splice(i,1);renderApprovals();showToast(`${item[0]} approved successfully.`,"Approved")}
function renderCompliance(){ $("domainList").innerHTML=state.domains.map(d=>`<div class="domain"><div class="domain-head"><span>${d[0]}</span><b>${d[1]}%</b></div><div class="domain-bar"><span style="width:${d[1]}%"></span></div></div>`).join("");$("exceptionList").innerHTML=state.exceptions.map(e=>`<div class="exception"><div class="exception-icon">△</div><div><strong>${e[0]}</strong><small>${e[2]}</small></div><span class="risk ${e[1].toLowerCase()}">${e[1]}</span></div>`).join("")}
function renderDepartments(){ $("departmentGrid").innerHTML=state.departments.map(d=>`<div class="department"><div class="dept-icon">${d[1]}</div><span class="dept-link" onclick="showToast('${d[0]} dashboard opened.')">View →</span><h3>${d[0]}</h3><p>Policy & control ownership</p><div class="dept-stats"><span><b>${d[2].split(" ")[0]}</b>Policies</span><span><b>${d[3]}</b>Compliance</span><span><b>${d[4].split(" ")[0]}</b>Lead</span></div></div>`).join("")}
function renderPeople(){
 const q=($("peopleSearch")?.value||"").toLowerCase();$("peopleGrid").innerHTML=state.people.filter(p=>p[0].toLowerCase().includes(q)||p[2].toLowerCase().includes(q)).map(p=>`<div class="person"><div class="person-avatar">${p[1]}</div><div><h3>${p[0]}</h3><p>${p[3]}</p></div><span class="role">${p[2]}</span></div>`).join("");
}
function renderDocuments(){ $("documentList").innerHTML=state.documents.map(d=>`<div class="document-row"><div class="doc-icon">▧</div><div><strong>${d[0]}</strong><small>${d[1]} · ${d[2]}</small></div><span class="doc-status">${d[3]}</span><button class="policy-menu" onclick="showToast('Opening ${d[0]}')">↗</button></div>`).join("")}
function renderNotifications(){ $("notificationList").innerHTML=state.notifications.map(n=>`<div class="notification ${n[4]?'unread':''}"><div class="notification-icon">${n[0]}</div><div><strong>${n[1]}</strong><p>${n[2]}</p></div><time>${n[3]}</time></div>`).join("")}
function markAllRead(){state.notifications.forEach(n=>n[4]=false);renderNotifications();showToast("All notifications marked as read.")}
function renderAudits(){
 const events=[["Policy published","Arvid","Information Security Policy","Oct 05, 20:41","Web","Success"],["Approval granted","Daniel Chen","Vendor Risk Management","Oct 05, 19:52","Web","Success"],["Policy updated","Arvid","Data Privacy Policy","Oct 05, 18:40","Web","Success"],["Login","Priya Menon","Workspace","Oct 05, 17:31","Web","Success"],["Evidence uploaded","Ravi Kumar","SOC 2 Type II Report","Oct 05, 16:12","Web","Success"],["Review requested","Arvid","Employee Conduct Policy","Oct 05, 15:48","Web","Success"],["Role changed","Arvid","Meera Shah","Oct 04, 14:20","Admin","Success"]];
 $("auditTable").innerHTML=events.map(e=>`<tr><td><strong>${e[0]}</strong></td><td>${e[1]}</td><td>${e[2]}</td><td>${e[3]}</td><td>${e[4]}</td><td><span class="risk low">${e[5]}</span></td></tr>`).join("");
}
function exportCSV(filename,rows){const csv=rows.map(r=>r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(",")).join("\n");const blob=new Blob([csv],{type:"text/csv"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=filename;a.click();URL.revokeObjectURL(a.href);showToast(`${filename} downloaded.`,"Export complete")}
function exportAudit(){exportCSV("policyflow-audit.csv",[["Event","User","Resource","Date","Source","Status"],["Policy published","Arvid","Information Security Policy","Oct 05 2026","Web","Success"],["Approval granted","Daniel Chen","Vendor Risk Management","Oct 05 2026","Web","Success"],["Policy updated","Arvid","Data Privacy Policy","Oct 05 2026","Web","Success"],["Evidence uploaded","Ravi Kumar","SOC 2 Type II Report","Oct 05 2026","Web","Success"]])}
function exportReport(){exportCSV("policyflow-governance-report.csv",[["Metric","Q1","Q2","Q3","Q4"],["Compliance","89%","91%","93%","94.8%"],["Active Policies","17","19","22","24"],["Control Gaps","14","12","9","7"],["Avg Approval Time","3.4d","2.8d","2.2d","1.8d"]])}
function printReport(){window.print()}

$("policyForm").addEventListener("submit",e=>{e.preventDefault();const name=$("newPolicyName").value.trim();const cat=$("newPolicyCategory").value;state.policies.unshift({id:Date.now(),name,cat,owner:"Arvid",status:"Draft",review:"—",version:"v1.0",desc:"New policy created from the PolicyFlow workspace."});renderPolicies();closeModal("policyModal");e.target.reset();showToast(`${name} added to the policy library.`,"Policy Created");navigate("policies")});
$("incidentForm").addEventListener("submit",e=>{e.preventDefault();closeModal("incidentModal");e.target.reset();showToast("Compliance exception logged and assigned to Arvid.","Exception Logged")});
$("departmentForm").addEventListener("submit",e=>{e.preventDefault();const name=$("deptName").value.trim();state.departments.push([name,"⌘","0 policies","100%","Arvid"]);renderDepartments();closeModal("departmentModal");e.target.reset();showToast(`${name} department added.`)});
$("personForm").addEventListener("submit",e=>{e.preventDefault();const name=$("personName").value.trim();const initials=name.split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase();state.people.push([name,initials,"Viewer","0 policies"]);renderPeople();closeModal("personModal");e.target.reset();showToast(`${name} has been invited.`,"Invitation Sent")});
$("documentForm").addEventListener("submit",e=>{e.preventDefault();const name=$("docName").value.trim();state.documents.unshift([name,"Evidence","—","Just now"]);renderDocuments();closeModal("documentModal");e.target.reset();showToast(`${name} added to the evidence vault.`,"Document Added")});
$("peopleSearch").addEventListener("input",renderPeople);
$("auditSearch").addEventListener("input",e=>{const q=e.target.value.toLowerCase();document.querySelectorAll("#auditTable tr").forEach(r=>r.style.display=r.innerText.toLowerCase().includes(q)?"":"none")});
document.querySelectorAll("[data-toggle]").forEach(t=>t.addEventListener("click",()=>t.classList.toggle("on")));
$("fileInput").addEventListener("change",e=>{if(e.target.files[0]){state.documents.unshift([e.target.files[0].name,"Uploaded",Math.round(e.target.files[0].size/1024)+" KB","Just now"]);renderDocuments();showToast(`${e.target.files[0].name} uploaded.`,"Upload complete")}});
$("dropZone").addEventListener("dragover",e=>{e.preventDefault();$("dropZone").style.borderColor="var(--accent)"});
$("dropZone").addEventListener("dragleave",()=>$("dropZone").style.borderColor="rgba(101,245,139,.25)");
$("dropZone").addEventListener("drop",e=>{e.preventDefault();$("dropZone").style.borderColor="rgba(101,245,139,.25)";const f=e.dataTransfer.files[0];if(f){state.documents.unshift([f.name,"Uploaded",Math.round(f.size/1024)+" KB","Just now"]);renderDocuments();showToast(`${f.name} uploaded.`,"Upload complete")}});
function saveSettings(){localStorage.setItem("policySettingsSaved","1");showToast("Workspace settings saved.","Settings Saved")}
$("globalSearch").addEventListener("keydown",e=>{if(e.key==="Enter"){const q=e.target.value.toLowerCase();const p=state.policies.find(x=>x.name.toLowerCase().includes(q));if(p){navigate("policies");$("policySearch").value=e.target.value;renderPolicies()}else showToast("No matching policy found.","Search")}});

renderPolicies();renderActivities();renderAttention();renderApprovals();renderCompliance();renderDepartments();renderPeople();renderDocuments();renderNotifications();renderAudits();
setTimeout(drawChart,50);
