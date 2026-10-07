/* Per-user dashboards: values and layout are seeded from each account, never empty */
function skDashboard(U) {
  let h = 2166136261;
  for (const ch of U.email) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const rnd = () => { h += 0x6d2b79f5; let t = Math.imul(h ^ (h >>> 15), 1 | h); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const between = (a, b) => Math.round(a + rnd() * (b - a));
  const inr = (n) => "₹" + n.toLocaleString("en-IN");

  const farmerRole = U.id % 2 === 0;
  const crops = ["Paddy", "Mango", "Chilli", "Turmeric", "Cotton", "Banana", "Groundnut", "Tomato", "Sweet corn", "Coconut"];
  const regions = ["Guntur", "Krishna", "Warangal", "Nellore", "Karimnagar", "Chittoor", "Khammam", "Anantapur", "Kurnool", "Nizamabad"];
  const people = ["Lakshmi Stores", "Ravi Kumar", "Hotel Annapurna", "Sneha Reddy", "Green Basket", "Venkat Rao", "Priya Foods", "Kiran Traders Co-op", "Meghana S", "Sai Catering"];
  const crop = pick(crops), region = pick(regions);
  const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];
  const series = months.map(() => between(25, 100));
  const orders = between(18, 240), total = between(40, 480) * 1000, partners = between(4, 60);
  const saved = Math.round(total * 0.18);

  const kpis = farmerRole
    ? [["Direct orders", orders], ["Earnings", inr(total)], ["Buyers connected", partners], ["Extra earned vs middlemen", inr(saved)]]
    : [["Orders placed", orders], ["Spent", inr(total)], ["Farmers connected", partners], ["Saved vs market", inr(saved)]];
  const rows = Array.from({ length: 5 }, () => [pick(people), pick(crops), between(20, 600) + " kg", inr(between(8, 90) * 100)]);
  const stages = ["Sowing", "Growth", "Flowering", "Harvest-ready"].map((s) => [s, between(30, 100)]);
  const extra = { Starter: "Upgrade to Pro to unlock files, team and billing.",
    Pro: `Top demand this month: ${pick(crops)} in ${pick(regions)}.`,
    Business: `${between(3, 9)} team members active · ${between(2, 8)} new buyer requests today.` }[U.plan];

  const label = farmerRole ? "Farmer" : "Customer";
  return `
    <h2>Welcome, <span class="grad">${U.name}</span> <span class="tag">${label}</span></h2>
    <p style="color:var(--mute);margin:-8px 0 20px">${farmerRole ? `${crop} grower · ${region}` : `Buying fresh ${crop.toLowerCase()} directly from ${region}`} · No middlemen</p>
    <div class="grid">${kpis.map((k) => `<div class="card"><p style="color:var(--mute)">${k[0]}</p><h2>${k[1]}</h2></div>`).join("")}</div><br>
    <div class="grid" style="grid-template-columns:1.2fr 1fr">
      <div class="card"><b>${farmerRole ? "Monthly earnings" : "Monthly spend"}</b>
        <div style="display:flex;align-items:flex-end;gap:12px;height:150px;margin-top:18px">
          ${series.map((v, i) => `<div style="flex:1;text-align:center"><div class="bar" style="height:${v * 1.3}px;width:100%;animation-delay:${i * 90}ms"></div><small style="color:var(--mute)">${months[i]}</small></div>`).join("")}
        </div></div>
      <div class="card"><b>${farmerRole ? "Crop progress" : "Delivery status"}</b>
        ${stages.map((s) => `<div style="margin:14px 0"><small>${s[0]} · ${s[1]}%</small><div class="bar" style="width:${s[1]}%"></div></div>`).join("")}</div>
    </div><br>
    <div class="card"><b>${farmerRole ? "Recent direct orders" : "My farmers"}</b>
      <table><tr><th>${farmerRole ? "Customer" : "Farmer"}</th><th>Crop</th><th>Quantity</th><th>Amount</th></tr>
      ${rows.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join("")}</table></div><br>
    <div class="card" style="border-color:#5fd38d55"><span class="tag">${U.plan}</span> ${extra}</div>`;
}
