const assignmentRules = {
  "Regulator": { cm: "Nick Lu", sm: "Tony Lau", finance: "Andy Chan", budget: "Legal & Compliance Department" },
  "Capital Market Stakeholder": { cm: "Charles Gao", sm: "Tony Lau", finance: "Andy Chan", budget: "Legal & Compliance Department" },
  "Certification Body": { cm: "Duane Voigt", sm: "Tony Lau", finance: "Andy Chan", budget: "Legal & Compliance Department" },
  "Client / Supplier": { cm: "Yau Alexander Mong Luo", sm: "Tony Lau", finance: "Andy Chan", budget: "" },
  "Internal Business Unit": { cm: "Duane Voigt", sm: "Tony Lau", finance: "Andy Chan", budget: "Information Security Team" },
  "Industry Standard": { cm: "Duane Voigt", sm: "Tony Lau", finance: "Andy Chan", budget: "Information Security Team" }
};

const mode1Steps = [
  "Register a Requirement",
  "Risk Assessment",
  "Risk Treatment Decision",
  "Risk Treatment Plan",
  "Implementation Report"
];

const defaultState = {
  selectedProgram: "COM-20260428-TG",
  programs: [
    {
      id: "COM-20260428-TG",
      title: "VISA ISO 27001 evidence requirement",
      party: "Client / Supplier",
      initiator: "Tao Guan",
      cm: "Yau Alexander Mong Luo",
      sm: "Tony Lau",
      finance: "Andy Chan",
      budget: "Enterprise Partnership BU",
      step: 2,
      status: "Risk Treatment Decision pending",
      summary: "VISA requires Dragonpass to maintain valid ISO 27001 control evidence and remediation records.",
      collaborators: ["Sammie Fung", "Tony Lau"],
      risks: [
        { title: "Incomplete evidence pack", date: "2026-06-10", inputter: "Tony Lau", description: "Evidence gaps may create audit findings and client escalation.", severity: 4, likelihood: 3, urgency: 3, documents: ["visa-evidence-gap.xlsx"] },
        { title: "Unclear ownership for remediation", date: "2026-06-11", inputter: "Sammie Fung", description: "Budget and operational ownership must be clarified before commitment.", severity: 3, likelihood: 3, urgency: 4, documents: [] }
      ]
    },
    {
      id: "COM-20260520-MP",
      title: "ICO UK privacy notice update",
      party: "Regulator",
      initiator: "Mary Pang",
      cm: "Nick Lu",
      sm: "Tony Lau",
      finance: "Andy Chan",
      budget: "Legal & Compliance Department",
      step: 1,
      status: "Risk Assessment draft",
      summary: "Assess new ICO guidance against current Dragonpass privacy notice and data processing workflows.",
      collaborators: ["Nick Lu", "Information Security Team"],
      risks: []
    },
    {
      id: "COM-20260315-NL",
      title: "CAC / MPS / MIIT implementation evidence",
      party: "Regulator",
      initiator: "Nick Lu",
      cm: "Nick Lu",
      sm: "Tony Lau",
      finance: "Andy Chan",
      budget: "Legal & Compliance Department",
      step: 4,
      status: "Implementation Report in review",
      summary: "Provide implementation report and updated treatment plan for Chinese cyber/data compliance obligations.",
      collaborators: ["Tao Guan", "Tony Lau"],
      risks: [
        { title: "Implementation report may miss security evidence", date: "2026-05-28", inputter: "Tony Lau", description: "Security annex must be complete before approval.", severity: 3, likelihood: 2, urgency: 4, documents: ["security-annex.docx"] }
      ]
    }
  ]
};

let state = loadState();

function loadState() {
  try {
    return JSON.parse(localStorage.getItem("dpcRedesignState")) || structuredClone(defaultState);
  } catch (error) {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem("dpcRedesignState", JSON.stringify(state));
}

function today() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function yyyymmdd(dateValue) {
  return (dateValue || today()).replaceAll("-", "");
}

function generateReference(dateValue, initials) {
  const safeInitials = (initials || "TG").trim().toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4) || "TG";
  return `COM-${yyyymmdd(dateValue)}-${safeInitials}`;
}

function getSelectedProgram() {
  return state.programs.find(p => p.id === state.selectedProgram) || state.programs[0];
}

function score(risk) {
  return Number(risk.severity) * Number(risk.likelihood) * Number(risk.urgency);
}

function scoreLabel(value) {
  if (value >= 48) return "High";
  if (value >= 24) return "Medium";
  return "Low";
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function renderTimelines() {
  document.querySelectorAll("[data-mode1-timeline], #dashboardTimeline").forEach(container => {
    if (!container) return;
    const program = getSelectedProgram();
    container.innerHTML = mode1Steps.map((step, index) => {
      const cls = index < program.step ? "done" : index === program.step ? "current" : "";
      const status = index < program.step ? "Completed" : index === program.step ? "Current" : "Upcoming";
      return `<div class="milestone ${cls}"><strong>${index + 1}. ${step}</strong><span>${status}</span></div>`;
    }).join("");
  });
}

function renderDashboard() {
  document.getElementById("metricPrograms").textContent = state.programs.length;
  document.getElementById("metricHighRisks").textContent = state.programs.flatMap(p => p.risks).filter(r => score(r) >= 48).length;
  const queue = document.getElementById("workQueue");
  queue.innerHTML = state.programs.map(program => `
    <article class="work-item">
      <div>
        <strong>${program.title}</strong>
        <small>${program.id} · ${program.party} · CM: ${program.cm}</small>
      </div>
      <button class="secondary select-program" data-id="${program.id}">${program.status}</button>
    </article>
  `).join("");

  const selector = document.getElementById("programSelector");
  selector.innerHTML = state.programs.map(program => `<option value="${program.id}">${program.id} · ${program.title}</option>`).join("");
  selector.value = getSelectedProgram().id;
  renderTimelines();
}

function renderRequirementSummary() {
  const program = getSelectedProgram();
  const box = document.getElementById("requirementSummary");
  if (!box) return;
  box.innerHTML = `
    <div class="panel-head"><h3>Requirement summary</h3><span class="pill pending">${program.status}</span></div>
    <table>
      <tbody>
        <tr><th>Reference ID</th><td>${program.id}</td></tr>
        <tr><th>Interested Party</th><td>${program.party}</td></tr>
        <tr><th>Initiator</th><td>${program.initiator}</td></tr>
        <tr><th>Compliance Manager</th><td>${program.cm}</td></tr>
        <tr><th>Security Manager</th><td>${program.sm}</td></tr>
        <tr><th>Finance BP</th><td>${program.finance}</td></tr>
        <tr><th>Budget Owner</th><td>${program.budget || "To be entered by requester"}</td></tr>
      </tbody>
    </table>
    <p class="muted">${program.summary}</p>
  `;
}

function renderRisks() {
  const program = getSelectedProgram();
  const list = document.getElementById("riskList");
  if (!list) return;
  if (!program.risks.length) {
    list.innerHTML = `<p class="muted">No risks have been added yet. Use the form above to capture input from the Compliance Manager, Security Manager, or collaborators.</p>`;
    return;
  }
  list.innerHTML = program.risks.map(risk => {
    const value = score(risk);
    const label = scoreLabel(value);
    const cls = label === "High" ? "high" : label === "Medium" ? "pending" : "ok";
    const docs = risk.documents?.length ? risk.documents.join(", ") : "No document selected in prototype";
    return `
      <article class="risk-item">
        <div class="panel-head">
          <div><strong>${risk.title}</strong><small>${risk.date} · Inputter: ${risk.inputter}</small></div>
          <span class="pill ${cls}">SLU ${value} · ${label}</span>
        </div>
        <p>${risk.description}</p>
        <small>Supporting documents: ${docs}</small>
      </article>
    `;
  }).join("");
}

function updateAssignmentPreview() {
  const party = document.getElementById("partySelect")?.value || "Regulator";
  const rule = assignmentRules[party];
  if (!rule) return;
  document.getElementById("assignedCm").value = rule.cm;
  document.getElementById("assignedSm").value = rule.sm;
  document.getElementById("assignedFinance").value = rule.finance;
  document.getElementById("assignedBudget").value = rule.budget;
  const manual = party === "Client / Supplier";
  document.getElementById("budgetOwnerAutoLabel").classList.toggle("hidden", manual);
  document.getElementById("budgetOwnerManualLabel").classList.toggle("hidden", !manual);
  document.getElementById("budgetOwnerNote").classList.toggle("hidden", !manual);
}

function updateReferencePreview() {
  const form = document.getElementById("programForm");
  if (!form) return;
  document.getElementById("referenceId").value = generateReference(form.date.value, form.initials.value);
}

function updateAdviceAssignment() {
  const language = document.getElementById("adviceLanguage")?.value || "English";
  document.getElementById("adviceCm").value = language === "Chinese" ? "Nick Lu" : "Duane Voigt";
}

function showView(viewId) {
  const target = document.getElementById(viewId) ? viewId : "dashboard";
  document.querySelectorAll(".view").forEach(v => v.classList.toggle("active", v.id === target));
  document.querySelectorAll(".nav-link").forEach(link => link.classList.toggle("active", link.dataset.view === target));
  const activeLink = document.querySelector(`.nav-link[data-view="${target}"]`);
  document.getElementById("pageTitle").textContent = activeLink ? activeLink.textContent.replace(/^\d\.\s*/, "") : "Overview Dashboard";
  history.replaceState(null, "", `#${target}`);
  renderAll();
}

function renderAll() {
  renderDashboard();
  renderRequirementSummary();
  renderRisks();
  renderTimelines();
}

function bindEvents() {
  document.querySelectorAll(".nav-link").forEach(link => link.addEventListener("click", event => {
    event.preventDefault();
    showView(link.dataset.view);
  }));
  document.querySelectorAll("[data-jump]").forEach(button => button.addEventListener("click", () => showView(button.dataset.jump)));
  document.addEventListener("click", event => {
    const selectButton = event.target.closest(".select-program");
    if (selectButton) {
      state.selectedProgram = selectButton.dataset.id;
      saveState();
      renderAll();
      showToast(`Selected ${selectButton.dataset.id}`);
    }
    if (event.target.matches(".approve")) showToast("Approval captured in prototype. Production will require identity, timestamp, and notification.");
    if (event.target.matches(".reject")) showToast("Rejection captured in prototype. Production workflow would close the ticket as rejected where applicable.");
  });
  document.getElementById("programSelector")?.addEventListener("change", event => {
    state.selectedProgram = event.target.value;
    saveState();
    renderAll();
  });
  const form = document.getElementById("programForm");
  if (form) {
    form.date.value = today();
    form.addEventListener("input", event => {
      if (["date", "initials"].includes(event.target.name)) updateReferencePreview();
    });
    form.party.addEventListener("change", updateAssignmentPreview);
    form.addEventListener("submit", event => {
      event.preventDefault();
      const fd = new FormData(form);
      const party = fd.get("party");
      const rule = assignmentRules[party];
      const files = [...form.documents.files].map(file => file.name);
      const budget = party === "Client / Supplier" ? (document.getElementById("manualBudgetOwner").value || "Manual budget owner required") : rule.budget;
      const program = {
        id: document.getElementById("referenceId").value,
        title: fd.get("title"),
        party,
        initiator: fd.get("initiator"),
        cm: rule.cm,
        sm: rule.sm,
        finance: rule.finance,
        budget,
        step: 0,
        status: "Requirement registered",
        summary: fd.get("summary") + (files.length ? ` Source documents: ${files.join(", ")}.` : ""),
        collaborators: [...form.collaborators.selectedOptions].map(option => option.textContent),
        risks: []
      };
      state.programs.unshift(program);
      state.selectedProgram = program.id;
      saveState();
      renderAll();
      showToast(`${program.id} created in local prototype data.`);
      showView("program-risk");
    });
  }
  document.getElementById("resetDemo")?.addEventListener("click", () => {
    state = structuredClone(defaultState);
    saveState();
    renderAll();
    showToast("Demo data reset.");
  });
  const riskForm = document.getElementById("riskForm");
  if (riskForm) {
    riskForm.date.value = today();
    riskForm.addEventListener("submit", event => {
      event.preventDefault();
      const fd = new FormData(riskForm);
      const program = getSelectedProgram();
      program.risks.push({
        title: fd.get("title"),
        date: fd.get("date"),
        inputter: fd.get("inputter"),
        description: fd.get("description"),
        severity: fd.get("severity"),
        likelihood: fd.get("likelihood"),
        urgency: fd.get("urgency"),
        documents: [...riskForm.documents.files].map(file => file.name)
      });
      program.step = Math.max(program.step, 1);
      program.status = "Risk Assessment in progress";
      saveState();
      renderAll();
      showToast("Risk added to selected requirement.");
    });
  }
  document.getElementById("adviceLanguage")?.addEventListener("change", updateAdviceAssignment);
}

function boot() {
  bindEvents();
  updateAssignmentPreview();
  updateReferencePreview();
  updateAdviceAssignment();
  const hash = location.hash.replace("#", "") || "dashboard";
  showView(hash);
}

document.addEventListener("DOMContentLoaded", boot);
