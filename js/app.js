const workflowSteps = [
  "Registration",
  "Risk Assessment",
  "Risk Treatment Decision",
  "Treatment Plan",
  "Implementation Report"
];

const defaultState = {
  activeUserId: "u-tao",
  selectedMatterId: "COM-20260428-TG",
  users: [
    { id: "u-tao", name: "Tao Guan", role: "General Counsel", department: "Legal & Compliance", status: "Active" },
    { id: "u-sammie", name: "Sammie Fung", role: "Compliance Manager / Approver", department: "Legal & Compliance", status: "Active" },
    { id: "u-tony", name: "Tony Lau", role: "Compliance Manager / Security", department: "Information Security", status: "Active" },
    { id: "u-andy", name: "Andy Chan", role: "Finance Business Partner", department: "Finance", status: "Active" },
    { id: "u-michelle", name: "Michelle Wong", role: "Budget Owner", department: "Enterprise Partnership BU", status: "Active" },
    { id: "u-mary", name: "Mary Pang", role: "Business Requester", department: "Product & Operations", status: "Active" }
  ],
  matters: [
    {
      id: "COM-20260428-TG",
      title: "VISA ISO 27001 evidence requirement",
      mode: "Compliance Program",
      interestedParty: "Client / Supplier",
      stage: 3,
      status: "Risk treatment decision pending",
      due: "2026-06-28",
      summary: "VISA requires Dragonpass to maintain ISO 27001 control evidence, remediation records, and client-facing assurance documentation.",
      requester: "Tao Guan",
      complianceManager: "Sammie Fung",
      securityManager: "Tony Lau",
      financeBP: "Andy Chan",
      budgetOwner: "Michelle Wong",
      approvers: ["Tao Guan", "Sammie Fung"],
      participants: ["Tao Guan", "Sammie Fung", "Tony Lau", "Andy Chan", "Michelle Wong"],
      actionOwners: [
        { name: "Sammie Fung", action: "Finalize risk treatment recommendation", priority: "High" },
        { name: "Tao Guan", action: "Review proposed treatment approach", priority: "High" },
        { name: "Andy Chan", action: "Validate budget assumptions", priority: "Medium" },
        { name: "Michelle Wong", action: "Confirm business budget ownership", priority: "Medium" }
      ],
      risks: ["Incomplete evidence pack", "Unclear remediation ownership"],
      lastUpdate: "Risk score and initial treatment proposal prepared by Legal & Compliance. Budget inputs remain open."
    },
    {
      id: "COM-20260520-MP",
      title: "ICO UK privacy notice update",
      mode: "Compliance Program",
      interestedParty: "Regulator",
      stage: 2,
      status: "Risk assessment in progress",
      due: "2026-07-05",
      summary: "Assess new ICO guidance against Dragonpass privacy notices, consent wording, and data processing workflows.",
      requester: "Mary Pang",
      complianceManager: "Sammie Fung",
      securityManager: "Tony Lau",
      financeBP: "Andy Chan",
      budgetOwner: "Legal & Compliance Department",
      approvers: ["Tao Guan", "Sammie Fung"],
      participants: ["Mary Pang", "Sammie Fung", "Tony Lau", "Tao Guan"],
      actionOwners: [
        { name: "Sammie Fung", action: "Complete privacy risk assessment", priority: "High" },
        { name: "Tony Lau", action: "Confirm security and data processing impact", priority: "Medium" },
        { name: "Mary Pang", action: "Respond to business workflow clarifications", priority: "Medium" }
      ],
      risks: ["Privacy notice may not reflect latest customer data usage", "Operational change may require business training"],
      lastUpdate: "Requester submitted source guidance and current notice links. Assessment comments are being collected."
    },
    {
      id: "COM-20260315-NL",
      title: "CAC / MPS / MIIT implementation evidence",
      mode: "Compliance Program",
      interestedParty: "Regulator",
      stage: 5,
      status: "Implementation report in review",
      due: "2026-06-30",
      summary: "Provide implementation evidence and an updated treatment plan for Chinese cyber and data compliance obligations.",
      requester: "Sammie Fung",
      complianceManager: "Tony Lau",
      securityManager: "Tony Lau",
      financeBP: "Andy Chan",
      budgetOwner: "Information Security Team",
      approvers: ["Tao Guan", "Sammie Fung"],
      participants: ["Tao Guan", "Sammie Fung", "Tony Lau", "Andy Chan"],
      actionOwners: [
        { name: "Tony Lau", action: "Upload final security evidence annex", priority: "High" },
        { name: "Tao Guan", action: "Review implementation report for closure", priority: "Medium" },
        { name: "Sammie Fung", action: "Confirm legal compliance position", priority: "Medium" }
      ],
      risks: ["Security annex may not map all control evidence", "Residual risk statement requires final sign-off"],
      lastUpdate: "Implementation report draft is ready. Closure depends on evidence annex and approver comments."
    },
    {
      id: "ADV-20260614-MP",
      title: "Compliance advice for AI vendor onboarding",
      mode: "Compliance Advice",
      interestedParty: "Client / Supplier",
      stage: 1,
      status: "Advice response requested",
      due: "2026-06-26",
      summary: "Business requester asks whether a proposed AI vendor may be onboarded and what contractual controls are required.",
      requester: "Mary Pang",
      complianceManager: "Sammie Fung",
      securityManager: "Tony Lau",
      financeBP: "Andy Chan",
      budgetOwner: "Product & Operations",
      approvers: ["Tao Guan"],
      participants: ["Mary Pang", "Sammie Fung", "Tony Lau", "Tao Guan"],
      actionOwners: [
        { name: "Sammie Fung", action: "Draft compliance advice and required safeguards", priority: "High" },
        { name: "Tony Lau", action: "Review AI vendor security questionnaire", priority: "Medium" }
      ],
      risks: ["Vendor processing terms may lack sufficient audit rights", "Data retention schedule needs confirmation"],
      lastUpdate: "Requester submitted business context and proposed vendor materials. Advice response is pending."
    }
  ]
};

let state = loadState();

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem("dpcRoleBasedState"));
    return stored && stored.users && stored.matters ? stored : structuredClone(defaultState);
  } catch (error) {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem("dpcRoleBasedState", JSON.stringify(state));
}

function $(selector) { return document.querySelector(selector); }
function $all(selector) { return Array.from(document.querySelectorAll(selector)); }
function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[char]));
}

function currentUser() {
  return state.users.find(user => user.id === state.activeUserId) || state.users[0];
}

function isGeneralCounsel(user = currentUser()) {
  return user.role.includes("General Counsel");
}

function visibleMatters(user = currentUser()) {
  if (isGeneralCounsel(user)) return state.matters;
  return state.matters.filter(matter => {
    const names = [
      matter.requester,
      matter.complianceManager,
      matter.securityManager,
      matter.financeBP,
      matter.budgetOwner,
      ...(matter.approvers || []),
      ...(matter.participants || []),
      ...(matter.actionOwners || []).map(owner => owner.name)
    ];
    return names.includes(user.name);
  });
}

function actionsFor(user = currentUser()) {
  return visibleMatters(user).flatMap(matter => (matter.actionOwners || [])
    .filter(owner => isGeneralCounsel(user) || owner.name === user.name)
    .map(owner => ({ ...owner, matterId: matter.id, matterTitle: matter.title, due: matter.due, status: matter.status })));
}

function selectedMatter() {
  const visible = visibleMatters();
  let selected = visible.find(matter => matter.id === state.selectedMatterId);
  if (!selected) {
    selected = visible[0] || state.matters[0];
    state.selectedMatterId = selected?.id;
    saveState();
  }
  return selected;
}

function badgeClass(priorityOrStatus) {
  const value = String(priorityOrStatus || "").toLowerCase();
  if (value.includes("high") || value.includes("pending")) return "red";
  if (value.includes("medium") || value.includes("progress") || value.includes("review")) return "amber";
  return "green";
}

function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2500);
}

function renderUserSelector() {
  const selector = $("#userSelector");
  selector.innerHTML = state.users.map(user => `<option value="${user.id}">${escapeHtml(user.name)} · ${escapeHtml(user.role)}</option>`).join("");
  selector.value = currentUser().id;
  $("#currentUserName").textContent = currentUser().name;
  $("#currentUserRole").textContent = currentUser().role;
}

function renderMetrics() {
  const user = currentUser();
  const matters = visibleMatters(user);
  const actions = actionsFor(user);
  const highPriority = actions.filter(action => action.priority === "High").length;
  const budgetItems = matters.filter(m => [m.financeBP, m.budgetOwner].includes(user.name)).length;
  $("#metricGrid").innerHTML = [
    ["Visible matters", matters.length, isGeneralCounsel(user) ? "All platform matters" : "Filtered to this user"],
    ["Required actions", actions.length, "Open items assigned to this user"],
    ["High priority", highPriority, "Require near-term attention"],
    ["Budget touchpoints", budgetItems, "Finance or budget ownership items"]
  ].map(([label, value, note]) => `<article><span>${label}</span><strong>${value}</strong><small>${note}</small></article>`).join("");
}

function renderActionQueue() {
  const actions = actionsFor();
  const target = $("#actionQueue");
  if (!actions.length) {
    target.innerHTML = `<div class="empty">No required actions are assigned to ${escapeHtml(currentUser().name)} at this time.</div>`;
    return;
  }
  target.innerHTML = actions.map(action => `
    <article class="work-card">
      <div>
        <span class="pill ${badgeClass(action.priority)}">${escapeHtml(action.priority)} priority</span>
        <strong>${escapeHtml(action.action)}</strong>
        <div class="meta">${escapeHtml(action.matterTitle)} · Due ${escapeHtml(action.due)} · ${escapeHtml(action.status)}</div>
      </div>
      <button class="secondary" data-select-matter="${escapeHtml(action.matterId)}" data-route-button="action">Open</button>
    </article>`).join("");
}

function renderSelectedMatterSummary() {
  const matter = selectedMatter();
  if (!matter) {
    $("#selectedMatterSummary").innerHTML = `<div class="empty">No visible matter selected.</div>`;
    return;
  }
  $("#selectedMatterSummary").innerHTML = `
    <article class="matter-card">
      <span class="pill ${badgeClass(matter.status)}">${escapeHtml(matter.status)}</span>
      <h3>${escapeHtml(matter.title)}</h3>
      <p class="meta">${escapeHtml(matter.mode)} · ${escapeHtml(matter.interestedParty)} · Due ${escapeHtml(matter.due)}</p>
      <p>${escapeHtml(matter.summary)}</p>
      ${renderTimeline(matter)}
    </article>`;
}

function renderTimeline(matter) {
  if (matter.mode === "Compliance Advice") {
    return `<div class="timeline"><div class="step-card current"><span class="step-num">1</span><div><strong>Advice response</strong><div class="meta">Compliance Manager and Security Manager prepare advice for requester.</div></div></div></div>`;
  }
  return `<div class="timeline">${workflowSteps.map((step, index) => `
    <div class="step-card ${index + 1 === matter.stage ? "current" : ""}">
      <span class="step-num">${index + 1}</span>
      <div><strong>${escapeHtml(step)}</strong><div class="meta">${index + 1 < matter.stage ? "Completed" : index + 1 === matter.stage ? "Current stage" : "Upcoming"}</div></div>
    </div>`).join("")}</div>`;
}

function renderMatterSelector() {
  const selector = $("#matterSelector");
  const matters = visibleMatters();
  selector.innerHTML = matters.map(matter => `<option value="${matter.id}">${escapeHtml(matter.id)} · ${escapeHtml(matter.title)}</option>`).join("");
  if (selectedMatter()) selector.value = state.selectedMatterId;
}

function renderMatterGrid() {
  const matters = visibleMatters();
  const target = $("#matterGrid");
  if (!matters.length) {
    target.innerHTML = `<div class="empty">No matters are currently associated with this user.</div>`;
    return;
  }
  target.innerHTML = matters.map(matter => `
    <article class="matter-card">
      <span class="pill ${badgeClass(matter.status)}">${escapeHtml(matter.mode)}</span>
      <h3>${escapeHtml(matter.title)}</h3>
      <p class="meta">${escapeHtml(matter.id)} · ${escapeHtml(matter.status)} · Due ${escapeHtml(matter.due)}</p>
      <p>${escapeHtml(matter.summary)}</p>
      <div class="matter-actions">
        <button class="secondary" data-select-matter="${escapeHtml(matter.id)}" data-route-button="action">Open workspace</button>
        <button class="ghost" data-select-matter="${escapeHtml(matter.id)}">Set as selected</button>
      </div>
    </article>`).join("");
}

function renderWorkspace() {
  const matter = selectedMatter();
  const userActions = actionsFor().filter(action => action.matterId === matter?.id);
  if (!matter) return;
  $("#workspaceMatter").innerHTML = `
    <article class="matter-card">
      <span class="pill ${badgeClass(matter.status)}">${escapeHtml(matter.status)}</span>
      <h3>${escapeHtml(matter.title)}</h3>
      <p class="meta">${escapeHtml(matter.id)} · ${escapeHtml(matter.mode)} · Due ${escapeHtml(matter.due)}</p>
      <p>${escapeHtml(matter.summary)}</p>
      <h3>My pending actions on this matter</h3>
      <div class="card-list">
        ${userActions.length ? userActions.map(action => `
          <div class="work-card">
            <div><strong>${escapeHtml(action.action)}</strong><div class="meta">Assigned to ${escapeHtml(isGeneralCounsel() ? action.name : currentUser().name)} · ${escapeHtml(action.priority)} priority</div></div>
            <button class="primary" data-complete-action="${escapeHtml(action.action)}">Mark demo complete</button>
          </div>`).join("") : `<div class="empty">This selected matter is visible to you, but no immediate action is currently assigned to you.</div>`}
      </div>
      <h3 style="margin-top:18px">Latest update</h3>
      <p class="meta">${escapeHtml(matter.lastUpdate)}</p>
      ${renderTimeline(matter)}
    </article>`;
}

function renderParticipantMatrix() {
  const matter = selectedMatter();
  const rows = [
    ["Requester", matter.requester],
    ["Compliance Manager", matter.complianceManager],
    ["Security Manager", matter.securityManager],
    ["Finance BP", matter.financeBP],
    ["Budget Owner", matter.budgetOwner],
    ["Approvers", matter.approvers.join(", ")]
  ];
  $("#participantMatrix").innerHTML = `<div class="participant-matrix">${rows.map(([role, name]) => `
    <div class="participant-row"><div><strong>${escapeHtml(role)}</strong><div class="meta">${escapeHtml(name)}</div></div><span class="pill ${name.includes(currentUser().name) ? "green" : ""}">${name.includes(currentUser().name) ? "You" : "Participant"}</span></div>`).join("")}</div>`;
}

function renderUsers() {
  const table = $("#userTable");
  if (!isGeneralCounsel()) {
    table.innerHTML = `<div class="empty">User administration is available only to the General Counsel role.</div>`;
    return;
  }
  table.innerHTML = `<div class="user-table">${state.users.map(user => `
    <div class="user-row">
      <div><strong>${escapeHtml(user.name)}</strong><div class="meta">${escapeHtml(user.department)}</div></div>
      <div>${escapeHtml(user.role)}</div>
      <span class="pill ${user.status === "Active" ? "green" : "amber"}">${escapeHtml(user.status)}</span>
    </div>`).join("")}</div>`;
}

function renderAccessControls() {
  const gc = isGeneralCounsel();
  $all(".gc-only").forEach(node => node.classList.toggle("hidden", !gc));
  if (!gc && location.hash.replace("#", "") === "users") navigate("dashboard");
}

function renderAll() {
  renderUserSelector();
  renderAccessControls();
  renderMetrics();
  renderActionQueue();
  renderMatterSelector();
  renderSelectedMatterSummary();
  renderMatterGrid();
  renderWorkspace();
  renderParticipantMatrix();
  renderUsers();
}

function routeTitle(route) {
  return ({ dashboard: "My Dashboard", matters: "My Matters", action: "Action Workspace", users: "User Administration", rules: "Role & Workflow Rules" })[route] || "My Dashboard";
}

function navigate(route) {
  const safeRoute = route || "dashboard";
  if (safeRoute === "users" && !isGeneralCounsel()) {
    showToast("User Administration is visible only to General Counsel.");
    route = "dashboard";
  }
  $all(".view").forEach(view => view.classList.toggle("active-view", view.id === route));
  $all(".nav-link").forEach(link => link.classList.toggle("active", link.dataset.route === route));
  $("#pageTitle").textContent = routeTitle(route);
  if (location.hash !== `#${route}`) history.replaceState(null, "", `#${route}`);
}

function bindEvents() {
  $("#userSelector").addEventListener("change", event => {
    state.activeUserId = event.target.value;
    const firstVisible = visibleMatters()[0];
    state.selectedMatterId = firstVisible?.id || state.selectedMatterId;
    saveState();
    renderAll();
    navigate(location.hash.replace("#", "") || "dashboard");
    showToast(`Switched to ${currentUser().name}`);
  });

  $("#matterSelector").addEventListener("change", event => {
    state.selectedMatterId = event.target.value;
    saveState();
    renderAll();
    showToast("Selected matter updated.");
  });

  document.addEventListener("click", event => {
    const matterButton = event.target.closest("[data-select-matter]");
    if (matterButton) {
      state.selectedMatterId = matterButton.dataset.selectMatter;
      saveState();
      renderAll();
    }
    const routeButton = event.target.closest("[data-route-button]");
    if (routeButton) navigate(routeButton.dataset.routeButton);
    const navLink = event.target.closest("[data-route]");
    if (navLink) {
      event.preventDefault();
      navigate(navLink.dataset.route);
    }
    const completeButton = event.target.closest("[data-complete-action]");
    if (completeButton) showToast("Demo action marked complete. Production should write an auditable approval record.");
  });

  $("#userForm").addEventListener("submit", event => {
    event.preventDefault();
    if (!isGeneralCounsel()) return showToast("Only General Counsel can add users.");
    const name = $("#newUserName").value.trim();
    if (!name) return showToast("Please enter a user name.");
    state.users.push({
      id: `u-${Date.now()}`,
      name,
      role: $("#newUserRole").value,
      department: "To be assigned",
      status: $("#newUserStatus").value
    });
    $("#newUserName").value = "";
    saveState();
    renderAll();
    showToast("Demo user added by General Counsel.");
  });

  window.addEventListener("hashchange", () => navigate(location.hash.replace("#", "") || "dashboard"));
}

document.addEventListener("DOMContentLoaded", () => {
  renderAll();
  bindEvents();
  navigate(location.hash.replace("#", "") || "dashboard");
});
