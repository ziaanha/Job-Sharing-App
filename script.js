
const jobs = [
  {id:1,title:"Junior Web Developer",company:"Bloom Digital",city:"Hyderabad",type:"Full-time",level:"Fresher",salary:22000,icon:"✿",color:"#ffe4ef",description:"Help build friendly, responsive websites with a creative digital team.",skills:["HTML","CSS","JavaScript"],about:"A beginner-friendly opportunity to work on website layouts, responsive pages and simple interactive features.",responsibilities:["Build and update web pages","Test pages on mobile and desktop","Work with designers and developers"]},
  {id:2,title:"Customer Support Associate",company:"Peach Connect",city:"Remote",type:"Remote",level:"Entry-level",salary:20000,icon:"♡",color:"#eee6ff",description:"Help customers, answer questions and make every interaction a good one.",skills:["Communication","Email","Problem solving"],about:"Support customers through chat and email while learning practical customer service skills.",responsibilities:["Respond to customer questions","Record support requests","Work with the support team"]},
  {id:3,title:"Data Entry Assistant",company:"Little Leaf Services",city:"Hyderabad",type:"Part-time",level:"Fresher",salary:15000,icon:"✧",color:"#fff0d8",description:"Organise information, maintain spreadsheets and keep records accurate.",skills:["MS Excel","Typing","Accuracy"],about:"A part-time role focused on accurate data entry and basic spreadsheet work.",responsibilities:["Enter and update records","Check data for errors","Organise digital files"]},
  {id:4,title:"Frontend Developer Intern",company:"Lavender Labs",city:"Remote",type:"Internship",level:"Fresher",salary:12000,icon:"⌘",color:"#e6eaff",description:"Learn from a small team while creating real frontend practice projects.",skills:["HTML","CSS","JavaScript"],about:"Build your portfolio through supervised frontend tasks and collaborative projects.",responsibilities:["Create responsive UI components","Fix layout issues","Participate in code reviews"]},
  {id:5,title:"Retail Store Assistant",company:"Petal & Co.",city:"Chennai",type:"Part-time",level:"Entry-level",salary:16000,icon:"❀",color:"#ffe7df",description:"Help shoppers, organise products and keep the store welcoming.",skills:["Customer service","Billing","Teamwork"],about:"Support daily store operations, customer service and product organisation.",responsibilities:["Assist customers","Arrange and restock products","Support billing when trained"]},
  {id:6,title:"Junior Python Intern",company:"Cloudberry Tech",city:"Remote",type:"Internship",level:"Fresher",salary:18000,icon:"⌘",color:"#e0f4ec",description:"Explore Python fundamentals and help with small software tasks.",skills:["Python","Logic","Git"],about:"A learning-focused internship with simple programming assignments and mentor guidance.",responsibilities:["Write basic Python scripts","Test code","Document small projects"]},
  {id:7,title:"Office Assistant",company:"Sunday Studio",city:"Hyderabad",type:"Full-time",level:"Entry-level",salary:18000,icon:"☁",color:"#f0e7ff",description:"Support everyday office tasks, records and team coordination.",skills:["MS Office","Organisation","Communication"],about:"Help the office run smoothly by managing records and assisting team members.",responsibilities:["Maintain files and records","Prepare simple documents","Coordinate routine office tasks"]},
  {id:8,title:"Social Media Intern",company:"Cherry Creative",city:"Remote",type:"Internship",level:"Fresher",salary:10000,icon:"♡",color:"#ffe4ed",description:"Help plan posts and create cheerful content for social platforms.",skills:["Canva","Writing","Creativity"],about:"Assist a creative team with social media planning and basic content production.",responsibilities:["Draft post ideas","Prepare simple graphics","Track post performance"]},
  {id:9,title:"Junior UI Designer",company:"Cloud Nine Design",city:"Bengaluru",type:"Full-time",level:"Entry-level",salary:28000,icon:"✧",color:"#e9e3ff",description:"Turn ideas into clear, thoughtful and accessible digital interfaces.",skills:["Figma","UI design","Prototyping"],about:"Collaborate with a design team on wireframes, interface layouts and prototypes.",responsibilities:["Create wireframes","Update design files","Work with developers"]},
  {id:10,title:"Computer Lab Assistant",company:"Bright Path Learning",city:"Chennai",type:"Part-time",level:"Fresher",salary:17000,icon:"⌘",color:"#dff2ff",description:"Help learners use computers and keep lab equipment organised.",skills:["Computer basics","Patience","MS Office"],about:"Assist with basic computer lab activities and help maintain an organised learning space.",responsibilities:["Prepare computers for sessions","Help with basic software questions","Maintain equipment records"]},
  {id:11,title:"QA Tester Intern",company:"Mallow Software",city:"Hyderabad",type:"Internship",level:"Fresher",salary:16000,icon:"✿",color:"#fff0d9",description:"Test websites, report bugs and learn how software quality works.",skills:["Testing","Attention to detail","Web basics"],about:"Learn manual testing through guided tasks and clear bug reports.",responsibilities:["Test website features","Document reproducible issues","Retest fixes"]},
  {id:12,title:"Billing Assistant",company:"Rosewood Retail",city:"Bengaluru",type:"Full-time",level:"Entry-level",salary:19000,icon:"♡",color:"#ffe3ed",description:"Assist with billing, receipts and day-to-day customer transactions.",skills:["POS","Basic maths","Customer service"],about:"Support checkout operations and keep transaction records organised.",responsibilities:["Process transactions after training","Issue receipts","Keep billing records accurate"]}
];

const $ = (selector) => document.querySelector(selector);
const storage = {
  get(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch { /* The app can still run without browser storage. */ }
  }
};

let savedJobs = storage.get("careernest-saved", []);
let applications = storage.get("careernest-applications", []);
let activeTab = "all";
let toastTimer;

const money = (amount) => "₹" + amount.toLocaleString("en-IN");
const jobById = (id) => jobs.find(job => job.id === Number(id));

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function saveState() {
  storage.set("careernest-saved", savedJobs);
  storage.set("careernest-applications", applications);
}

function updateCounts() {
  $("#savedCount").textContent = savedJobs.length;
  $("#appliedCount").textContent = applications.length;
  $("#allCount").textContent = jobs.length;
  $("#statSaved").textContent = savedJobs.length;
  $("#statApplied").textContent = applications.length;
  $("#statInterview").textContent = applications.filter(a => a.status === "Interview").length;
  $("#resultCount").textContent = `${getFilteredJobs().length} opportunit${getFilteredJobs().length === 1 ? "y" : "ies"}`;
}

function getFilteredJobs() {
  const query = $("#searchInput").value.trim().toLowerCase();
  const location = $("#locationInput").value.trim().toLowerCase();
  const type = $("#typeFilter").value;
  const level = $("#levelFilter").value;
  const minSalary = Number($("#salaryFilter").value || 0);

  return jobs.filter(job => {
    const searchable = `${job.title} ${job.company} ${job.city} ${job.skills.join(" ")}`.toLowerCase();
    const matchesQuery = !query || searchable.includes(query);
    const matchesLocation = !location || job.city.toLowerCase().includes(location) || (location.includes("remote") && job.type === "Remote");
    const matchesType = !type || job.type === type;
    const matchesLevel = !level || job.level === level;
    const matchesSalary = job.salary >= minSalary;
    const matchesTab = activeTab === "all"
      || (activeTab === "saved" && savedJobs.includes(job.id))
      || (activeTab === "applied" && applications.some(app => app.jobId === job.id));
    return matchesQuery && matchesLocation && matchesType && matchesLevel && matchesSalary && matchesTab;
  });
}

function renderJobs() {
  const filtered = getFilteredJobs();
  $("#jobGrid").innerHTML = filtered.map(job => `
    <article class="job-card">
      <div class="job-top">
        <div class="company-logo" style="background:${job.color};color:#76576a">${job.icon}</div>
        <button class="save-btn ${savedJobs.includes(job.id) ? "saved" : ""}" data-save="${job.id}" aria-label="${savedJobs.includes(job.id) ? "Unsave" : "Save"} ${job.title}">${savedJobs.includes(job.id) ? "♥" : "♡"}</button>
      </div>
      <h3>${job.title}</h3>
      <div class="company-name">${job.company} · ${job.city}</div>
      <div class="job-tags">
        <span class="tag">${job.type}</span>
        <span class="tag lavender">${job.level}</span>
      </div>
      <p class="job-description">${job.description}</p>
      <div class="job-bottom">
        <div class="salary">${money(job.salary)}<small>per month · demo estimate</small></div>
        <button class="details-btn" data-details="${job.id}">View details ↗</button>
      </div>
    </article>
  `).join("");

  $("#emptyState").hidden = filtered.length !== 0;
  $("#jobGrid").hidden = filtered.length === 0;
  updateCounts();
}

function renderApplications() {
  if (!applications.length) {
    $("#applicationList").innerHTML = `<div class="no-applications">♡<br><br>Your application diary is empty for now.<br>When you apply to a demo listing, it will appear here.</div>`;
    updateCounts();
    return;
  }

  $("#applicationList").innerHTML = applications.map(app => {
    const job = jobById(app.jobId);
    if (!job) return "";
    return `
      <div class="application-row">
        <div class="company-logo" style="background:${job.color};color:#76576a">${job.icon}</div>
        <div class="application-info">
          <strong>${job.title}</strong>
          <small>${job.company} · Applied ${app.date}</small>
        </div>
        <select class="status-select" data-status="${job.id}" aria-label="Application status">
          ${["Applied","Reviewing","Interview","Offer","Rejected"].map(status => `<option ${app.status === status ? "selected" : ""}>${status}</option>`).join("")}
        </select>
        <button class="remove-application" data-remove="${job.id}" aria-label="Remove application">×</button>
      </div>`;
  }).join("");
  updateCounts();
}

function openJob(id) {
  const job = jobById(id);
  if (!job) return;
  const applied = applications.some(app => app.jobId === job.id);
  $("#modalContent").innerHTML = `
    <div class="company-logo" style="background:${job.color};color:#76576a">${job.icon}</div>
    <h2 id="modalTitle">${job.title}</h2>
    <div class="modal-company">${job.company} · ${job.city}</div>
    <div class="job-tags"><span class="tag">${job.type}</span><span class="tag lavender">${job.level}</span></div>
    <h4>About this role ♡</h4>
    <p class="modal-description">${job.about}</p>
    <h4>What you may do</h4>
    <ul>${job.responsibilities.map(item => `<li>${item}</li>`).join("")}</ul>
    <h4>Helpful skills</h4>
    <div class="job-tags">${job.skills.map(skill => `<span class="tag">${skill}</span>`).join("")}</div>
    <p class="modal-description"><strong>Demo salary estimate:</strong> ${money(job.salary)} per month. This fictional listing has not been verified as a real vacancy.</p>
    <div class="modal-actions">
      <button class="primary-btn" data-apply="${job.id}" ${applied ? "disabled" : ""}>${applied ? "Already added ♡" : "Track demo application ↗"}</button>
      <button class="secondary-btn" data-save="${job.id}">${savedJobs.includes(job.id) ? "♥ Saved" : "♡ Save job"}</button>
    </div>
  `;
  $("#jobModal").hidden = false;
  document.body.style.overflow = "hidden";
}

function closeModal() {
  $("#jobModal").hidden = true;
  document.body.style.overflow = "";
}

function applyToJob(id) {
  const job = jobById(id);
  if (!job || applications.some(app => app.jobId === job.id)) {
    showToast("You've already added this listing to your diary ♡");
    return;
  }
  applications.unshift({
    jobId: job.id,
    date: new Date().toLocaleDateString("en-IN"),
    status: "Applied"
  });
  saveState();
  renderApplications();
  renderJobs();
  openJob(job.id);
  showToast("Added to your demo application diary ♡");
}

function setTab(tab) {
  activeTab = tab;
  document.querySelectorAll(".tab").forEach(button => button.classList.toggle("active", button.dataset.tab === tab));
  renderJobs();
}

function clearFilters() {
  $("#searchInput").value = "";
  $("#locationInput").value = "";
  $("#typeFilter").value = "";
  $("#levelFilter").value = "";
  $("#salaryFilter").value = "";
  setTab("all");
}

$("#searchBtn").addEventListener("click", renderJobs);
$("#searchInput").addEventListener("input", renderJobs);
$("#locationInput").addEventListener("input", renderJobs);
$("#typeFilter").addEventListener("change", renderJobs);
$("#levelFilter").addEventListener("change", renderJobs);
$("#salaryFilter").addEventListener("change", renderJobs);
$("#clearFilters").addEventListener("click", clearFilters);
$("#emptyReset").addEventListener("click", clearFilters);
$("#modalClose").addEventListener("click", closeModal);
$("#jobModal").addEventListener("click", event => {
  if (event.target === $("#jobModal")) closeModal();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeModal();
});

document.addEventListener("click", event => {
  const saveButton = event.target.closest("[data-save]");
  if (saveButton) {
    const id = Number(saveButton.dataset.save);
    savedJobs = savedJobs.includes(id)
      ? savedJobs.filter(savedId => savedId !== id)
      : [...savedJobs, id];
    saveState();
    renderJobs();
    renderApplications();
    if (!$("#jobModal").hidden) openJob(id);
    showToast(savedJobs.includes(id) ? "Saved to your little list ♡" : "Removed from saved jobs");
    return;
  }

  const detailsButton = event.target.closest("[data-details]");
  if (detailsButton) {
    openJob(detailsButton.dataset.details);
    return;
  }

  const applyButton = event.target.closest("[data-apply]");
  if (applyButton) {
    applyToJob(applyButton.dataset.apply);
    return;
  }

  const removeButton = event.target.closest("[data-remove]");
  if (removeButton) {
    applications = applications.filter(app => app.jobId !== Number(removeButton.dataset.remove));
    saveState();
    renderApplications();
    renderJobs();
    showToast("Removed from your application diary");
  }
});

document.addEventListener("change", event => {
  if (event.target.matches("[data-status]")) {
    const id = Number(event.target.dataset.status);
    const app = applications.find(item => item.jobId === id);
    if (app) {
      app.status = event.target.value;
      saveState();
      renderApplications();
      showToast("Application status updated ♡");
    }
  }
});

document.querySelectorAll(".tab").forEach(button => {
  button.addEventListener("click", () => setTab(button.dataset.tab));
});

renderJobs();
renderApplications();
