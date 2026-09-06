// ---------------- Year ----------------
document.querySelectorAll('#year').forEach(el => el.textContent = new Date().getFullYear());

// ---------------- Mobile nav ----------------
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if(navToggle && navLinks){
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
}

// ---------------- Contact modal ----------------
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');

function openModal(){
  if(!modalOverlay) return;
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(){
  if(!modalOverlay) return;
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-open-modal]').forEach(el => {
  el.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
});
if(modalClose) modalClose.addEventListener('click', closeModal);
if(modalOverlay){
  modalOverlay.addEventListener('click', (e) => { if(e.target === modalOverlay) closeModal(); });
}
document.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeModal(); });

// ---------------- Contact form (AJAX via FormSubmit, no backend needed) ----------------
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if(contactForm){
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalLabel = submitBtn.textContent;
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;
    formStatus.className = 'form-status';

    const formData = new FormData(contactForm);
    const email = contactForm.getAttribute('action').split('/').pop();

    try{
      const res = await fetch(`https://formsubmit.co/ajax/${email}`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      });
      if(res.ok){
        formStatus.textContent = "Thanks — your message is on its way. I'll reply by email shortly.";
        formStatus.classList.add('show', 'ok');
        contactForm.reset();
      } else {
        throw new Error('Request failed');
      }
    } catch(err){
      formStatus.textContent = "Something went wrong sending that. Please email umeraleem1001@gmail.com directly.";
      formStatus.classList.add('show', 'err');
    } finally {
      submitBtn.textContent = originalLabel;
      submitBtn.disabled = false;
    }
  });
}

// ---------------- Project accordion ----------------
document.querySelectorAll('[data-toggle-project]').forEach(head => {
  head.addEventListener('click', () => {
    const project = head.closest('.project');
    const wasOpen = project.classList.contains('is-open');
    project.parentElement.querySelectorAll('.project').forEach(p => p.classList.remove('is-open'));
    if(!wasOpen) project.classList.add('is-open');
  });
});

// ---------------- Reporting widget (demo): Care Coordinator Task Performance ----------------
// Each task's minutes are scaled against a fixed max (45) so bar heights stay comparable across days.
const MAX_MINUTES = 45;
const reportDatasets = [
  { // Today
    coordinators: 38, tasks: 512,
    rows: [
      { name:'Outreach',  desired:15, actual:18 },
      { name:'Care Plan', desired:30, actual:26 },
      { name:'Med Recon', desired:20, actual:24 },
      { name:'Discharge', desired:25, actual:23 },
      { name:'Referral',  desired:35, actual:41 }
    ]
  },
  { // Yesterday
    coordinators: 41, tasks: 486,
    rows: [
      { name:'Outreach',  desired:15, actual:16 },
      { name:'Care Plan', desired:30, actual:33 },
      { name:'Med Recon', desired:20, actual:19 },
      { name:'Discharge', desired:25, actual:28 },
      { name:'Referral',  desired:35, actual:37 }
    ]
  },
  { // Last Monday
    coordinators: 35, tasks: 460,
    rows: [
      { name:'Outreach',  desired:15, actual:14 },
      { name:'Care Plan', desired:30, actual:29 },
      { name:'Med Recon', desired:20, actual:22 },
      { name:'Discharge', desired:25, actual:24 },
      { name:'Referral',  desired:35, actual:33 }
    ]
  }
];
let reportIndex = 0;
const refreshBtn = document.getElementById('refreshReport');
if(refreshBtn){
  refreshBtn.addEventListener('click', () => {
    reportIndex = (reportIndex + 1) % reportDatasets.length;
    const d = reportDatasets[reportIndex];

    document.getElementById('kpiCoordinators').textContent = d.coordinators;
    document.getElementById('kpiTasks').textContent = d.tasks;

    const totalDesired = d.rows.reduce((s,r) => s + r.desired, 0);
    const totalDiff = d.rows.reduce((s,r) => s + (r.actual - r.desired), 0);
    const variance = (totalDiff / totalDesired) * 100;
    const varianceEl = document.getElementById('kpiVariance');
    varianceEl.textContent = (variance >= 0 ? '+' : '') + variance.toFixed(1) + '%';

    const cols = document.querySelectorAll('#barChart .bar-col');
    cols.forEach((col, i) => {
      const r = d.rows[i];
      const diff = r.actual - r.desired;
      col.querySelector('.bar-diff').textContent = (diff >= 0 ? '+' : '') + diff + 'm';
      col.querySelector('.bar-fill.desired').style.height = Math.round((r.desired / MAX_MINUTES) * 100) + '%';
      col.querySelector('.bar-fill.actual').style.height = Math.round((r.actual / MAX_MINUTES) * 100) + '%';
    });
  });
}

// ---------------- Migration widget (demo): SAP + S3 inventory + DBMS -> Lake -> Warehouse ----------------
const runMigrationBtn = document.getElementById('runMigration');
const migLineFill = document.getElementById('migLineFill');
const migProgressFill = document.getElementById('migProgressFill');
const migPercent = document.getElementById('migPercent');
const migRecords = document.getElementById('migRecords');
const dotSource = document.getElementById('dotSource');
const dotStaging = document.getElementById('dotStaging');
const dotValidate = document.getElementById('dotValidate');
const dotWarehouse = document.getElementById('dotWarehouse');
const TOTAL_RECORDS = 1284300;

if(runMigrationBtn){
  runMigrationBtn.addEventListener('click', () => {
    runMigrationBtn.disabled = true;
    runMigrationBtn.textContent = 'Running…';
    [dotSource, dotStaging, dotValidate, dotWarehouse].forEach(d => d.classList.remove('done'));
    dotSource.classList.add('done');

    let progress = 0;
    const duration = 4200;
    const start = performance.now();

    function tick(now){
      const elapsed = now - start;
      progress = Math.min(100, (elapsed / duration) * 100);

      migLineFill.style.width = progress + '%';
      migProgressFill.style.width = progress + '%';
      migPercent.textContent = Math.round(progress) + '%';
      migRecords.textContent = Math.round((progress/100) * TOTAL_RECORDS).toLocaleString() + ' / ' + TOTAL_RECORDS.toLocaleString() + ' records';

      if(progress >= 33) dotStaging.classList.add('done');
      if(progress >= 66) dotValidate.classList.add('done');
      if(progress >= 100) dotWarehouse.classList.add('done');

      if(progress < 100){
        requestAnimationFrame(tick);
      } else {
        runMigrationBtn.disabled = false;
        runMigrationBtn.textContent = 'Run migration again';
      }
    }
    requestAnimationFrame(tick);
  });
}

const demoData = [
  {
    q: "Which region had the highest growth last quarter?",
    a: "Based on the available business data, Region X recorded the highest growth last quarter, driven by a rise in repeat orders and a new distribution channel."
  },
  {
    q: "What data sources contribute to this report?",
    a: "This report is built from three conformed sources: the sales data warehouse, the CRM pipeline feed, and the operations lakehouse — joined on a shared customer and region key."
  },
  {
    q: "Show me customer segments with the highest growth.",
    a: "The mid-market segment shows the strongest quarter-over-quarter growth, followed by enterprise renewals. Both are validated against the conformed customer dimension."
  }
];

const demoSelect = document.getElementById('demoSelect');
const demoAsk = document.getElementById('demoAsk');
const demoQuestion = document.getElementById('demoQuestion');
const demoAnswer = document.getElementById('demoAnswer');

if(demoAsk){
  demoAsk.addEventListener('click', () => {
    const item = demoData[demoSelect.value];
    demoQuestion.textContent = item.q;
    demoAnswer.style.opacity = 0.3;
    demoAnswer.textContent = 'Thinking…';
    setTimeout(() => {
      demoAnswer.style.opacity = 1;
      demoAnswer.textContent = item.a;
    }, 500);
  });
}
