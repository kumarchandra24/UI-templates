/* Sreekaram customer app: hash-routed modules, per-user features */
let U;
try { U = JSON.parse(localStorage.getItem("sk_user")); } catch (e) {}
if (!U) location.href = "login.html";
document.documentElement.style.setProperty("--user", U.color);

const $ = (id) => document.getElementById(id);
const money = (n) => "₹" + n.toLocaleString("en-IN");
const store = {
  get: (k, d) => { try { return JSON.parse(localStorage.getItem(k + U.email)) ?? d; } catch (e) { return d; } },
  set: (k, v) => { try { localStorage.setItem(k + U.email, JSON.stringify(v)); } catch (e) {} },
};
const ALL = ["dashboard", "onboarding", "billing", "settings", "team", "users", "integrations", "help", "docs", "calendar", "files", "workspace"];
const cap = (s) => s[0].toUpperCase() + s.slice(1);

const pages = {
  dashboard: () => skDashboard(U),

  onboarding: () => {
    const steps = ["Verify email", "Set up profile", "Invite a teammate", "Connect an integration", "Create first project"];
    const done = store.get("onb", []);
    return `<h2>Onboarding</h2><div class="card">${steps.map((s, i) =>
      `<label style="display:block"><input type="checkbox" style="width:auto" ${done.includes(i) ? "checked" : ""}
       onchange="toggleStep(${i})"> ${s}</label>`).join("")}
       <div class="bar" style="width:${(done.length / steps.length) * 100}%;margin-top:14px"></div></div>`;
  },

  billing: () => `<h2>Billing</h2><div class="card"><p>Current plan: <b>${U.plan}</b></p><p>Next invoice: ${U.plan === "Business" ? "₹2,999" : "₹999"} on 1st of next month</p></div><br>
    <div class="card"><table><tr><th>Invoice</th><th>Amount</th><th>Status</th></tr>
    ${["Sep", "Aug", "Jul"].map((m, i) => `<tr><td>${m} 2026</td><td>${U.plan === "Business" ? "₹2,999" : "₹999"}</td><td><span class="tag">Paid</span></td></tr>`).join("")}</table></div>`,

  settings: () => `<h2>Account Settings</h2><div class="card"><label>Name</label><input id="sn" value="${U.name}">
    <label>Accent color</label><input id="sc" type="color" value="${U.color}">
    <button class="btn" onclick="saveSettings()">Save</button> <button class="btn ghost" onclick="logout()">Log out</button></div>`,

  team: () => `<h2>Team Management</h2><div class="card"><table>${["Asha (Admin)", "Ravi (Editor)", "Meera (Viewer)"].map((m) =>
    `<tr><td>${m}</td><td><span class="tag">active</span></td></tr>`).join("")}</table></div>`,

  users: () => `<h2>User Management</h2><div class="card"><table><tr><th>User</th><th>Role</th></tr>
    ${(window.SK_USERS || []).slice(0, 8).map((u) => `<tr><td>${u.name}</td><td>${u.plan}</td></tr>`).join("") ||
    "<tr><td>Team members appear here</td><td></td></tr>"}</table></div>`,

  integrations: () => {
    const on = store.get("int", []);
    return `<h2>Integrations</h2><div class="grid">${["Slack", "Google Drive", "Razorpay", "WhatsApp", "GitHub", "Zapier"].map((n) =>
      `<div class="card"><b>${n}</b><br><br><button class="btn ${on.includes(n) ? "" : "ghost"}" onclick="toggleInt('${n}')">
      ${on.includes(n) ? "Connected" : "Connect"}</button></div>`).join("")}</div>`;
  },

  help: () => `<h2>Help Center</h2><input id="hs" placeholder="Search help..." oninput="filterHelp()"><div id="hl">${helpList("")}</div>`,

  docs: () => `<h2>Documentation</h2><div class="card"><h3>Getting started</h3><p>Log in, finish onboarding, then explore modules from the sidebar.</p>
    <pre style="background:#0d0d22;padding:12px;border-radius:10px;margin-top:10px">curl https://api.sreekaram.in/v1/me -H "Authorization: Bearer YOUR_KEY"</pre></div>`,

  calendar: () => {
    const ev = store.get("ev", [5, 12, 19]);
    return `<h2>Calendar</h2><div class="card"><div class="cal">${Array.from({ length: 30 }, (_, i) =>
      `<div class="${ev.includes(i + 1) ? "ev" : ""}" onclick="toggleDay(${i + 1})">${i + 1}</div>`).join("")}</div>
      <p style="color:var(--mute);margin-top:10px">Click a day to add or remove an event.</p></div>`;
  },

  files: () => {
    const f = store.get("files", ["brand-kit.pdf", "pricing.xlsx"]);
    return `<h2>Files</h2><div class="card"><input id="nf" placeholder="New file name"><button class="btn" onclick="addFile()">Add</button>
      <table>${f.map((x, i) => `<tr><td>${x}</td><td><a href="#files" onclick="delFile(${i})">Delete</a></td></tr>`).join("")}</table></div>`;
  },

  workspace: () => {
    const m = store.get("msgs", [{ w: "Sreekaram", t: "Welcome to the shared workspace!" }]);
    return `<h2>Collaboration Workspace</h2><div class="card">${m.map((x) => `<p><b>${x.w}:</b> ${x.t}</p>`).join("")}
      <input id="msg" placeholder="Write a message"><button class="btn" onclick="send()">Send</button></div>`;
  },
};

const HELP = ["How to reset password", "Upgrade my plan", "Invite teammates", "Connect Razorpay", "Export my data"];
const helpList = (q) => HELP.filter((h) => h.toLowerCase().includes(q)).map((h) => `<div class="card" style="margin:8px 0">${h}</div>`).join("");
const filterHelp = () => ($("hl").innerHTML = helpList($("hs").value.toLowerCase()));

function toggleIn(key, val, fallback) {
  const a = store.get(key, fallback);
  const i = a.indexOf(val);
  i < 0 ? a.push(val) : a.splice(i, 1);
  store.set(key, a);
  route();
}
const toggleStep = (i) => toggleIn("onb", i, []);
const toggleInt = (n) => toggleIn("int", n, []);
const toggleDay = (d) => toggleIn("ev", d, [5, 12, 19]);
function addFile() { const v = $("nf").value.trim(); if (v) { const f = store.get("files", []); f.push(v); store.set("files", f); route(); } }
function delFile(i) { const f = store.get("files", []); f.splice(i, 1); store.set("files", f); }
function send() { const v = $("msg").value.trim(); if (v) { const m = store.get("msgs", []); m.push({ w: U.name, t: v }); store.set("msgs", m); route(); } }
function saveSettings() {
  U.name = $("sn").value; U.color = $("sc").value;
  try { localStorage.setItem("sk_user", JSON.stringify(U)); } catch (e) {}
  document.documentElement.style.setProperty("--user", U.color);
  buildSide(); route();
}
function logout() { try { localStorage.removeItem("sk_user"); } catch (e) {} location.href = "login.html"; }

function buildSide() {
  const cur = location.hash.slice(1) || "dashboard";
  $("side").innerHTML = `<b class="brand" style="margin-bottom:6px">Sreekaram</b><p style="color:var(--mute);font-size:12px;margin-bottom:14px">${U.name} · ${U.plan}</p>` +
    ALL.map((p) => U.features.includes(p)
      ? `<a href="#${p}" class="${cur === p ? "on" : ""}">${cap(p)}</a>`
      : `<a class="lock" title="Upgrade to unlock">${cap(p)}</a>`).join("") +
    `<a href="#" onclick="openPal();return false">Command palette · Ctrl+K</a>`;
}
function route() {
  const p = location.hash.slice(1) || "dashboard";
  $("view").innerHTML = U.features.includes(p) ? pages[p]() : "<h2>Upgrade required</h2><p>This module is not in your plan.</p>";
  buildSide();
}
function openPal() { $("pal").classList.add("open"); $("q").value = ""; $("q").focus(); paint(""); }
function paint(q) {
  $("res").innerHTML = U.features.filter((p) => p.includes(q.toLowerCase())).map((p) => `<a href="#${p}" onclick="closePal()">Go to ${cap(p)}</a>`).join("");
}
const closePal = () => $("pal").classList.remove("open");
$("q").oninput = (e) => paint(e.target.value);
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openPal(); }
  if (e.key === "Escape") closePal();
});
window.addEventListener("hashchange", route);
document.write || 0;
const s = document.createElement("script"); s.src = "assets/data.js"; s.onload = route; document.head.appendChild(s);
