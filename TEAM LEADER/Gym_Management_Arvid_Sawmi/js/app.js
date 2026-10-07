const members = [
 {id:1,name:"Karthik Raman",email:"karthik@email.com",phone:"+91 98765 12340",plan:"Annual",joined:"12 Jan 2026",expiry:"12 Jan 2027",status:"active",initials:"KR"},
 {id:2,name:"Priya Nair",email:"priya@email.com",phone:"+91 98765 22891",plan:"Quarterly",joined:"18 Jul 2026",expiry:"18 Oct 2026",status:"expiring",initials:"PN"},
 {id:3,name:"Aditya Kumar",email:"aditya@email.com",phone:"+91 98765 44321",plan:"Annual",joined:"02 Mar 2026",expiry:"02 Mar 2027",status:"active",initials:"AK"},
 {id:4,name:"Meera Joseph",email:"meera@email.com",phone:"+91 98765 99812",plan:"Monthly",joined:"29 Sep 2026",expiry:"29 Oct 2026",status:"active",initials:"MJ"},
 {id:5,name:"Rahul Dev",email:"rahul@email.com",phone:"+91 98765 77221",plan:"Quarterly",joined:"11 Jul 2026",expiry:"11 Oct 2026",status:"expiring",initials:"RD"},
 {id:6,name:"Sanjana Rao",email:"sanjana@email.com",phone:"+91 98765 11982",plan:"Annual",joined:"21 Feb 2026",expiry:"21 Feb 2027",status:"active",initials:"SR"},
 {id:7,name:"Vikram Singh",email:"vikram@email.com",phone:"+91 98765 33671",plan:"Monthly",joined:"04 Aug 2026",expiry:"04 Sep 2026",status:"inactive",initials:"VS"},
 {id:8,name:"Nisha Patel",email:"nisha@email.com",phone:"+91 98765 45129",plan:"Annual",joined:"15 Apr 2026",expiry:"15 Apr 2027",status:"active",initials:"NP"}
];

const attendance = [
 ["Karthik Raman","KR","05:42 PM","78 min"],["Priya Nair","PN","05:37 PM","62 min"],["Aditya Kumar","AK","05:21 PM","94 min"],["Meera Joseph","MJ","05:13 PM","51 min"],["Rahul Dev","RD","05:04 PM","87 min"],["Sanjana Rao","SR","04:58 PM","70 min"]
];

const payments = [
 ["INV-10482","Karthik Raman","Annual","05 Oct 2026","₹24,999","UPI","paid"],
 ["INV-10481","Meera Joseph","Monthly","05 Oct 2026","₹2,499","Card","paid"],
 ["INV-10480","Rahul Dev","Quarterly","04 Oct 2026","₹6,999","UPI","paid"],
 ["INV-10479","Nisha Patel","Annual","03 Oct 2026","₹24,999","Bank","paid"],
 ["INV-10478","Priya Nair","Quarterly","02 Oct 2026","₹6,999","UPI","pending"],
 ["INV-10477","Sanjana Rao","Annual","01 Oct 2026","₹24,999","Card","paid"]
];

const activities = [["Karthik Raman","KR","Checked in","05:42 PM"],["Priya Nair","PN","Completed workout","05:37 PM"],["Aditya Kumar","AK","Checked in","05:21 PM"],["Meera Joseph","MJ","New membership","05:13 PM"],["Rahul Dev","RD","Checked in","05:04 PM"]];

const workouts = [
 ["Strength Foundation","Build strength with compound movements.","45 min • 4 days/week","SF","Beginner"],
 ["Hypertrophy Pro","Structured muscle-building program.","60 min • 5 days/week","HP","Intermediate"],
 ["Fat Loss Circuit","High-intensity full-body conditioning.","45 min • 5 days/week","FL","Advanced"],
 ["Power & Performance","Explosive training for athletic performance.","75 min • 4 days/week","PP","Advanced"],
 ["Mobility Reset","Mobility, stretching and recovery.","30 min • 3 days/week","MR","All levels"],
 ["Core & Conditioning","Core stability plus functional conditioning.","40 min • 4 days/week","CC","Intermediate"]
];

const trainers = [
 ["Arjun Menon","Strength & Conditioning","AM","24 active clients","5 yrs"],
 ["Divya Sharma","Nutrition & Fitness","DS","31 active clients","4 yrs"],
 ["Rohan Iyer","CrossFit & Performance","RI","18 active clients","7 yrs"],
 ["Ananya Rao","Yoga & Mobility","AR","16 active clients","3 yrs"],
 ["Vivek Kumar","Hypertrophy Coach","VK","28 active clients","6 yrs"],
 ["Neha Singh","Personal Training","NS","21 active clients","5 yrs"]
];

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function initials(name){return name.split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase()}
function memberRow(m, actions=true){
 return `<tr><td><div class="member-cell"><div class="avatar">${m.initials}</div><div><b>${m.name}</b><small>ID #IV-${String(m.id).padStart(4,"0")}</small></div></div></td><td>${m.phone}<br><small style="color:#999">${m.email}</small></td><td>${m.plan}</td><td>${m.joined}</td><td>${m.expiry}</td><td><span class="status ${m.status}">${m.status}</span></td><td>${actions?`<button class="action-btn" onclick="editMember(${m.id})">•••</button>`:""}</td></tr>`
}
function renderMembers(){
 const q=($("#memberSearch")?.value||"").toLowerCase(), f=$("#memberFilter")?.value||"all";
 const filtered=members.filter(m=>(f==="all"||m.status===f)&&`${m.name} ${m.email} ${m.phone}`.toLowerCase().includes(q));
 $("#membersTable").innerHTML=filtered.map(m=>memberRow(m)).join("");
 $("#recentMembers").innerHTML=members.slice(0,5).map(m=>`<tr><td><div class="member-cell"><div class="avatar">${m.initials}</div><div><b>${m.name}</b><small>${m.email}</small></div></div></td><td>${m.plan}</td><td>${m.joined}</td><td><span class="status ${m.status}">${m.status}</span></td></tr>`).join("");
}
function renderAttendance(){
 $("#attendanceList").innerHTML=attendance.map(a=>`<div class="att-row"><div class="avatar">${a[1]}</div><div class="member-cell"><div><b>${a[0]}</b><small>Workout floor</small></div></div><span class="att-time">${a[2]}</span><span class="att-time">${a[3]}</span></div>`).join("");
 $("#checkedInCount").textContent=86+attendance.length-6;
 const vals=[62,74,81,69,88,92,86], days=["Tue","Wed","Thu","Fri","Sat","Sun","Mon"];
 $("#weekBars").innerHTML=vals.map((v,i)=>`<div class="bar-col"><b style="font-size:8px">${v}</b><div class="bar" style="height:${v*1.75}px"></div><span>${days[i]}</span></div>`).join("");
}
function renderActivities(){ $("#activityList").innerHTML=activities.map(a=>`<div class="activity"><div class="activity-avatar">${a[1]}</div><div><b>${a[0]}</b><small>${a[2]}</small></div><time>${a[3]}</time></div>`).join(""); }
function renderPayments(){
 $("#paymentsTable").innerHTML=payments.map(p=>`<tr><td><b>${p[0]}</b></td><td>${p[1]}</td><td>${p[2]}</td><td>${p[3]}</td><td><b>${p[4]}</b></td><td>${p[5]}</td><td><span class="status ${p[6]==="paid"?"active":"expiring"}">${p[6]}</span></td></tr>`).join("");
}
function renderWorkouts(){ $("#workoutGrid").innerHTML=workouts.map(w=>`<article class="workout-card"><div class="workout-top"><div class="workout-symbol">${w[3]}</div><span class="tag">${w[4]}</span></div><h3>${w[0]}</h3><p>${w[1]}</p><small style="font-size:8px;color:#777">${w[2]}</small><div><button class="secondary" style="margin-top:15px;padding:8px 11px" onclick="assignWorkout('${w[0]}')">Assign program →</button></div></article>`).join("");}
function renderTrainers(){ $("#trainerGrid").innerHTML=trainers.map(t=>`<article class="trainer-card"><div class="trainer-top"><div class="trainer-photo">${t[2]}</div><div><span class="eyebrow">COACH</span><h3 style="margin:3px 0">${t[0]}</h3><small style="font-size:8px;color:#888">${t[1]}</small></div></div><div class="trainer-meta"><span>${t[3]}</span><b>${t[4]} experience</b></div></article>`).join("");}
function drawChart(){
 const c=$("#revenueChart"); if(!c)return; const ctx=c.getContext("2d"), dpr=devicePixelRatio||1, w=c.clientWidth,h=c.clientHeight;c.width=w*dpr;c.height=h*dpr;ctx.scale(dpr,dpr);
 ctx.clearRect(0,0,w,h);ctx.strokeStyle="#eee";ctx.lineWidth=1;
 for(let i=1;i<5;i++){let y=i*h/5;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
 const vals=[44,52,47,63,57,75,68,86,82,95,91,100], max=110, step=w/(vals.length-1);
 ctx.beginPath();vals.forEach((v,i)=>{let x=i*step,y=h-(v/max*h*.82)-10;i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.strokeStyle="#111";ctx.lineWidth=2.5;ctx.stroke();
 vals.forEach((v,i)=>{let x=i*step,y=h-(v/max*h*.82)-10;ctx.beginPath();ctx.arc(x,y,3,0,Math.PI*2);ctx.fillStyle="#111";ctx.fill()});
}
function openModal(type, data={}){
 let html="";
 if(type==="member") html=`<span class="eyebrow">MEMBER MANAGEMENT</span><h2>${data.id?"Edit member":"Add new member"}</h2><p>Create a complete member profile and membership.</p><form id="memberForm"><div class="form-grid"><div class="form-group"><label>Full name<input name="name" required value="${data.name||""}" placeholder="e.g. Arjun Kumar"></label></div><div class="form-group"><label>Phone<input name="phone" required value="${data.phone||""}" placeholder="+91..."></label></div><div class="form-group"><label>Email<input name="email" type="email" value="${data.email||""}" placeholder="member@email.com"></label></div><div class="form-group"><label>Membership<select name="plan"><option ${data.plan==="Monthly"?"selected":""}>Monthly</option><option ${data.plan==="Quarterly"?"selected":""}>Quarterly</option><option ${data.plan==="Annual"?"selected":""}>Annual</option></select></label></div></div><div class="modal-actions"><button type="button" class="secondary" onclick="closeModal()">Cancel</button><button class="primary">${data.id?"Save Member":"Create Member"}</button></div></form>`;
 if(type==="checkin") html=`<span class="eyebrow">ATTENDANCE</span><h2>Check in member</h2><p>Search for a member and record today's visit.</p><form id="checkinForm"><div class="form-group"><label>Member<select name="member">${members.filter(m=>m.status!=="inactive").map(m=>`<option>${m.name}</option>`).join("")}</select></label></div><div class="form-group"><label>Check-in time<input name="time" type="time" value="17:45"></label></div><div class="modal-actions"><button type="button" class="secondary" onclick="closeModal()">Cancel</button><button class="primary">Confirm Check-in</button></div></form>`;
 if(type==="payment") html=`<span class="eyebrow">FINANCE</span><h2>Record payment</h2><p>Add a new transaction to the payment ledger.</p><form id="paymentForm"><div class="form-grid"><div class="form-group"><label>Member<select name="member">${members.map(m=>`<option>${m.name}</option>`).join("")}</select></label></div><div class="form-group"><label>Amount<input name="amount" required placeholder="₹ 0"></label></div><div class="form-group"><label>Plan<select name="plan"><option>Monthly</option><option>Quarterly</option><option>Annual</option></select></label></div><div class="form-group"><label>Method<select name="method"><option>UPI</option><option>Card</option><option>Bank</option><option>Cash</option></select></label></div></div><div class="modal-actions"><button type="button" class="secondary" onclick="closeModal()">Cancel</button><button class="primary">Save Payment</button></div></form>`;
 if(type==="workout") html=`<span class="eyebrow">TRAINING PROGRAM</span><h2>Create workout</h2><p>Build a program your trainers can assign.</p><form id="workoutForm"><div class="form-grid"><div class="form-group full"><label>Program name<input name="name" required placeholder="e.g. Athletic Power"></label></div><div class="form-group"><label>Duration<input name="duration" placeholder="60 min"></label></div><div class="form-group"><label>Level<select name="level"><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label></div><div class="form-group full"><label>Description<input name="desc" placeholder="Program objective..."></label></div></div><div class="modal-actions"><button type="button" class="secondary" onclick="closeModal()">Cancel</button><button class="primary">Create Program</button></div></form>`;
 if(type==="trainer") html=`<span class="eyebrow">COACHING TEAM</span><h2>Add trainer</h2><p>Add a coach to your gym team.</p><form id="trainerForm"><div class="form-grid"><div class="form-group"><label>Full name<input name="name" required></label></div><div class="form-group"><label>Specialization<input name="spec" placeholder="Strength & Conditioning"></label></div></div><div class="modal-actions"><button type="button" class="secondary" onclick="closeModal()">Cancel</button><button class="primary">Add Trainer</button></div></form>`;
 $("#modalContent").innerHTML=html;$("#modalBackdrop").classList.add("show");
}
function closeModal(){$("#modalBackdrop").classList.remove("show")}
function toast(msg){const el=document.createElement("div");el.className="toast";el.textContent="✓  "+msg;$("#toastContainer").appendChild(el);setTimeout(()=>el.remove(),2800)}
function navigate(page){$$(".page").forEach(p=>p.classList.remove("active"));$(`#${page}`).classList.add("active");$$(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.page===page));$("#pageTitle").textContent=page[0].toUpperCase()+page.slice(1);if(window.innerWidth<780)$("#sidebar").classList.remove("open");window.scrollTo(0,0);drawChart();}
function editMember(id){openModal("member",members.find(m=>m.id===id))}
function assignWorkout(name){toast(`${name} is ready to assign — select a member in the next step.`);openModal("checkin")}
window.closeModal=closeModal;window.editMember=editMember;window.assignWorkout=assignWorkout;

document.addEventListener("click",e=>{
 const nav=e.target.closest(".nav-item");if(nav){navigate(nav.dataset.page);return}
 const link=e.target.closest("[data-page-link]");if(link){navigate(link.dataset.pageLink);return}
 const action=e.target.closest("[data-action]");if(action){const a=action.dataset.action;openModal(a==="open-member"?"member":a);return}
});
$("#modalClose").onclick=closeModal;$("#modalBackdrop").addEventListener("click",e=>{if(e.target.id==="modalBackdrop")closeModal()});
$("#menuBtn").onclick=()=>$("#sidebar").classList.toggle("open");
$("#themeBtn").onclick=()=>{document.body.classList.toggle("dark");localStorage.setItem("dark",document.body.classList.contains("dark"));toast(document.body.classList.contains("dark")?"Dark mode enabled":"Light mode enabled")};
if(localStorage.getItem("dark")==="true")document.body.classList.add("dark");
$("#notificationBtn").onclick=()=>toast("You have 4 new gym notifications.");
$("#logoutBtn").onclick=()=>toast("Demo logout: session remains active in this local prototype.");
$("#memberSearch").addEventListener("input",renderMembers);$("#memberFilter").addEventListener("change",renderMembers);
$("#paymentSearch").addEventListener("input",e=>{$$("#paymentsTable tr").forEach(r=>r.style.display=r.textContent.toLowerCase().includes(e.target.value.toLowerCase())?"":"none")});
$("#exportMembers").onclick=()=>{const csv="Name,Email,Phone,Plan,Joined,Expiry,Status\n"+members.map(m=>[m.name,m.email,m.phone,m.plan,m.joined,m.expiry,m.status].join(",")).join("\n");const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download="ironvault-members.csv";a.click();toast("Member CSV exported.");};
$("#printReport").onclick=()=>window.print();
$("#saveSettings").onclick=()=>toast("Settings saved successfully.");
$$(".toggle").forEach(t=>t.onclick=()=>t.classList.toggle("on"));
document.addEventListener("submit",e=>{
 e.preventDefault();const form=e.target;
 if(form.id==="memberForm"){const fd=new FormData(form), name=fd.get("name");const existing=members.find(m=>m.name===name);if(!existing)members.unshift({id:Date.now(),name,email:fd.get("email"),phone:fd.get("phone"),plan:fd.get("plan"),joined:"05 Oct 2026",expiry:fd.get("plan")==="Annual"?"05 Oct 2027":fd.get("plan")==="Quarterly"?"05 Jan 2027":"05 Nov 2026",status:"active",initials:initials(name)});renderMembers();closeModal();toast(existing?"Member updated.":"New member added successfully.");}
 if(form.id==="checkinForm"){const fd=new FormData(form);const m=members.find(x=>x.name===fd.get("member"));attendance.unshift([m.name,m.initials,fd.get("time"),"0 min"]);renderAttendance();closeModal();toast(`${m.name} checked in successfully.`);}
 if(form.id==="paymentForm"){const fd=new FormData(form);payments.unshift([`INV-${10500+payments.length}`,fd.get("member"),fd.get("plan"),"05 Oct 2026",fd.get("amount").startsWith("₹")?fd.get("amount"):"₹"+fd.get("amount"),fd.get("method"),"paid"]);renderPayments();closeModal();toast("Payment recorded successfully.");}
 if(form.id==="workoutForm"){const fd=new FormData(form);workouts.unshift([fd.get("name"),fd.get("desc")||"Custom training program.",fd.get("duration")||"60 min",initials(fd.get("name")),"Custom"]);renderWorkouts();closeModal();toast("Workout program created.");}
 if(form.id==="trainerForm"){const fd=new FormData(form);trainers.unshift([fd.get("name"),fd.get("spec")||"Fitness Coach",initials(fd.get("name")), "0 active clients","New"]);renderTrainers();closeModal();toast("Trainer added successfully.");}
});
function reportBars(){let vals=[35,44,39,58,63,76,82,90];$("#growthBars").innerHTML=vals.map(v=>`<i style="height:${v}%"></i>`).join("")}
renderMembers();renderAttendance();renderActivities();renderPayments();renderWorkouts();renderTrainers();reportBars();drawChart();window.addEventListener("resize",drawChart);