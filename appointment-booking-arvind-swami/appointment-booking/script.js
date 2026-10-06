const doctors=[
{name:"Dr. Sarah Mitchell",specialty:"Cardiology",rating:"4.9",reviews:128,initials:"SM",color:"blue"},
{name:"Dr. Michael Chen",specialty:"Dermatology",rating:"4.8",reviews:96,initials:"MC",color:"purple"},
{name:"Dr. Priya Sharma",specialty:"Neurology",rating:"4.9",reviews:142,initials:"PS",color:"green"},
{name:"Dr. James Wilson",specialty:"Orthopedics",rating:"4.7",reviews:84,initials:"JW",color:"blue"},
{name:"Dr. Emily Carter",specialty:"Pediatrics",rating:"4.9",reviews:117,initials:"EC",color:"purple"},
{name:"Dr. Daniel Lee",specialty:"Cardiology",rating:"4.8",reviews:75,initials:"DL",color:"green"}
];
let specialty="all";
const list=document.querySelector("#doctorList"), search=document.querySelector("#doctorSearch"), modal=document.querySelector("#modal"), toast=document.querySelector("#toast");
function render(){
 const q=search.value.toLowerCase();
 const found=doctors.filter(d=>(specialty==="all"||d.specialty===specialty)&&(d.name.toLowerCase().includes(q)||d.specialty.toLowerCase().includes(q)));
 list.innerHTML=found.length?found.map(d=>`<article class="doctor"><div class="doc-avatar ${d.color}">${d.initials}</div><div><b>${d.name}</b><small>${d.specialty} • <span class="rating">★ ${d.rating}</span> (${d.reviews})</small><small>● Available today · Video & in-clinic</small></div><button class="book" data-name="${d.name}">Book</button></article>`).join(""):`<div style="padding:25px;text-align:center;color:#8993a2;font-size:10px;grid-column:1/-1">No doctors found. Try another search.</div>`;
 document.querySelectorAll(".book").forEach(b=>b.onclick=()=>openBooking(b.dataset.name));
}
function openBooking(name){
 document.querySelector("#modalDoctor").innerHTML=doctors.map(d=>`<option>${d.name} — ${d.specialty}</option>`).join("");
 if(name){const d=doctors.find(x=>x.name===name);document.querySelector("#modalDoctor").value=`${d.name} — ${d.specialty}`;}
 const dt=new Date();dt.setDate(dt.getDate()+1);document.querySelector("#date").value=dt.toISOString().slice(0,10);
 document.querySelectorAll(".time-slots button").forEach(x=>x.classList.remove("selected"));
 modal.classList.add("show");
}
function notify(msg){toast.querySelector("span").textContent=msg;toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),3000)}
search.oninput=render;
document.querySelectorAll(".chip").forEach(c=>c.onclick=()=>{document.querySelectorAll(".chip").forEach(x=>x.classList.remove("active"));c.classList.add("active");specialty=c.dataset.specialty;render()});
document.querySelector("#bookHero").onclick=()=>openBooking();
document.querySelector("#close").onclick=()=>modal.classList.remove("show");
modal.onclick=e=>{if(e.target===modal)modal.classList.remove("show")};
document.querySelector("#menu").onclick=()=>document.querySelector("#sidebar").classList.toggle("open");
document.querySelector("#notifications").onclick=()=>document.querySelector("#notice").classList.toggle("show");
document.querySelector("#notice button").onclick=()=>document.querySelector("#notice").classList.remove("show");
document.querySelector("#explore").onclick=()=>document.querySelector("#find-doctors").scrollIntoView({behavior:"smooth"});
document.querySelector("#allDoctors").onclick=()=>{specialty="all";document.querySelectorAll(".chip").forEach(x=>x.classList.toggle("active",x.dataset.specialty==="all"));render();document.querySelector("#find-doctors").scrollIntoView({behavior:"smooth"})};
document.querySelector("#filter").onclick=()=>notify("Tip: choose a specialty chip to filter doctors.");
document.querySelector("#calendarBtn").onclick=()=>notify("Calendar view is ready — your appointments are highlighted.");
document.querySelector("#upgrade").onclick=()=>notify("MediNova Plus preview opened.");
document.querySelectorAll(".toggle-choice button").forEach(b=>b.onclick=()=>{document.querySelectorAll(".toggle-choice button").forEach(x=>x.classList.remove("active"));b.classList.add("active")});
document.querySelectorAll(".time-slots button").forEach(b=>b.onclick=()=>{document.querySelectorAll(".time-slots button").forEach(x=>x.classList.remove("selected"));b.classList.add("selected")});
document.querySelector("#confirm").onclick=()=>{
 const selected=document.querySelector(".time-slots .selected"); if(!selected){notify("Please choose an available time.");return}
 const name=document.querySelector("#modalDoctor").value.split(" — ")[0];
 const date=new Date(document.querySelector("#date").value);
 document.querySelector("#appointmentBadge").textContent="4";
 modal.classList.remove("show");
 notify(`Appointment booked with ${name} for ${date.toLocaleDateString("en-IN",{day:"numeric",month:"short"})} at ${selected.textContent}.`);
};
const days=document.querySelector("#days");
[...Array(31)].forEach((_,i)=>{const d=document.createElement("div");d.className="day";d.textContent=i+1;if([2,7,14,24,28].includes(i+1))d.classList.add("appointment");if(i+1===24)d.classList.add("today");d.onclick=()=>notify(`October ${i+1}: ${[24,28].includes(i+1)?"You have an appointment.":"No appointment scheduled."}`);days.appendChild(d)});
render();
