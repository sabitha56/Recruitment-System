// HireDesk - front-end only recruitment system. Data is kept in localStorage.
const STATUSES = ["Applied", "Shortlisted", "Interview", "Hired", "Rejected"];
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));

let jobs = load("hd_jobs", [
  { id: 1, title: "Frontend Developer", company: "Brightwave", location: "Chennai", type: "Full-time", skills: ["HTML", "CSS", "JavaScript"], desc: "Build responsive interfaces for our hiring products." },
  { id: 2, title: "Data Analyst Intern", company: "Northpeak", location: "Remote", type: "Internship", skills: ["Excel", "SQL", "Python"], desc: "Clean data sets and build weekly dashboards." },
  { id: 3, title: "HR Executive", company: "Kavya Foods", location: "Bengaluru", type: "Full-time", skills: ["Communication", "Screening"], desc: "Screen candidates and coordinate interviews." },
]);
let apps = load("hd_apps", []);
let applyingTo = null;

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const toast = (msg) => { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); setTimeout(() => t.classList.remove("show"), 2200); };

// ---- Navigation
document.querySelectorAll(".tab").forEach((b) =>
  b.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t === b));
    document.querySelectorAll(".view").forEach((v) => (v.hidden = v.id !== b.dataset.view));
  })
);

// ---- Jobs
function renderJobs() {
  const q = $("#q").value.toLowerCase().trim();
  const type = $("#type").value;
  const list = jobs.filter((j) =>
    (!type || j.type === type) &&
    (!q || [j.title, j.company, j.skills.join(" ")].join(" ").toLowerCase().includes(q))
  );
  $("#jobList").innerHTML = list.length
    ? list.map((j) => `
      <article class="card">
        <h3>${esc(j.title)}</h3>
        <p class="meta">${esc(j.company)} &middot; ${esc(j.location)} &middot; ${esc(j.type)}</p>
        <p>${esc(j.desc)}</p>
        <div class="chips">${j.skills.map((s) => `<span class="chip">${esc(s)}</span>`).join("")}</div>
        <div class="row">
          <button class="link" data-del="${j.id}">Remove job</button>
          <button class="primary" data-apply="${j.id}">Apply now</button>
        </div>
      </article>`).join("")
    : `<p class="empty">No jobs match your search. Try a different keyword.</p>`;
}
$("#q").addEventListener("input", renderJobs);
$("#type").addEventListener("change", renderJobs);

$("#jobList").addEventListener("click", (e) => {
  const a = e.target.closest("[data-apply]"), d = e.target.closest("[data-del]");
  if (a) {
    applyingTo = jobs.find((j) => j.id == a.dataset.apply);
    $("#applyTitle").textContent = `Apply for ${applyingTo.title}`;
    $("#applyDlg").showModal();
  }
  if (d && confirm("Remove this job?")) {
    jobs = jobs.filter((j) => j.id != d.dataset.del);
    save("hd_jobs", jobs); renderJobs(); toast("Job removed");
  }
});

$("#jobForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = Object.fromEntries(new FormData(e.target));
  jobs.unshift({ id: Date.now(), title: f.title, company: f.company, location: f.location, type: f.type,
    skills: f.skills.split(",").map((s) => s.trim()).filter(Boolean), desc: f.desc });
  save("hd_jobs", jobs); e.target.reset(); renderJobs(); toast("Job published");
  document.querySelector('[data-view="jobs"]').click();
});

// ---- Applications
$("#cancelApply").addEventListener("click", () => $("#applyDlg").close());
$("#applyForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  apps.unshift({
    id: Date.now(), jobId: applyingTo.id, jobTitle: applyingTo.title, company: applyingTo.company,
    name: f.get("name"), email: f.get("email"), phone: f.get("phone"), note: f.get("note"),
    resume: f.get("resume")?.name || "Not attached", // only the file name is stored (localStorage limit)
    status: "Applied", date: new Date().toLocaleDateString(),
  });
  save("hd_apps", apps); e.target.reset(); $("#applyDlg").close(); renderApps(); toast("Application sent");
});

function renderApps() {
  $("#count").textContent = apps.length;
  $("#appList").innerHTML = apps.length
    ? `<div class="list">${apps.map((a) => `
      <article class="card">
        <h3>${esc(a.name)}</h3>
        <p class="meta">${esc(a.jobTitle)} at ${esc(a.company)} &middot; ${esc(a.date)}</p>
        <p>${esc(a.email)}${a.phone ? " &middot; " + esc(a.phone) : ""}<br>Resume: ${esc(a.resume)}</p>
        ${a.note ? `<p>${esc(a.note)}</p>` : ""}
        <div class="row">
          <label>Status
            <select class="status" data-id="${a.id}" style="color:var(--s-${a.status.toLowerCase()})">
              ${STATUSES.map((s) => `<option ${s === a.status ? "selected" : ""}>${s}</option>`).join("")}
            </select>
          </label>
        </div>
      </article>`).join("")}</div>`
    : `<p class="empty">No applications yet. They will appear here once candidates apply.</p>`;
}
$("#appList").addEventListener("change", (e) => {
  if (!e.target.matches(".status")) return;
  const a = apps.find((x) => x.id == e.target.dataset.id);
  a.status = e.target.value; save("hd_apps", apps); renderApps(); toast(`Status: ${a.status}`);
});

renderJobs(); renderApps();
