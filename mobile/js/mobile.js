/* ============================================================
   UCSC STUDENT HEALTH — MOBILE APP JS
   ============================================================ */

// ─── Tab switcher (pill tabs) ──────────────────────────────
function mTab(btn, id) {
  const bar = btn.closest('.m-tabs');
  if (!bar) return;
  bar.querySelectorAll('.m-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const parent = bar.parentElement;
  parent.querySelectorAll('.m-tab-pane').forEach(p => p.classList.remove('active'));
  const pane = parent.querySelector('#mt-' + id);
  if (pane) pane.classList.add('active');
}

// ─── Resource segment tabs ─────────────────────────────────
function mResTab(btn, id) {
  const bar = btn.closest('.m-seg-tabs');
  if (!bar) return;
  bar.querySelectorAll('.m-seg-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  document.querySelectorAll('.m-res-pane').forEach(p => p.style.display = 'none');
  const pane = document.querySelector('#mr-' + id);
  if (pane) pane.style.display = '';
}

// ─── Result accordion ──────────────────────────────────────
function mToggleResult(id) {
  const card = document.getElementById(id);
  if (!card) return;
  card.classList.toggle('open');
}

// ─── Filter chips ──────────────────────────────────────────
function mFilter(el) {
  const bar = el.closest('.m-filter-bar');
  if (!bar) return;
  bar.querySelectorAll('.m-filter-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}

// ─── Provider / type card selection ───────────────────────
function mSelectCard(el, groupSelector) {
  const grid = el.closest(groupSelector || '.m-provider-grid, .m-appt-type-grid, [data-select-group]');
  if (grid) grid.querySelectorAll('.m-provider-card, .m-type-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
}

// ─── Time slot selection ───────────────────────────────────
function mSelectTime(el) {
  if (el.classList.contains('unavailable')) return;
  const grid = el.closest('.m-time-grid');
  if (grid) grid.querySelectorAll('.m-time-slot').forEach(s => s.classList.remove('selected'));
  el.classList.add('selected');
}

// ─── Booking step wizard ───────────────────────────────────
function mBookStep(step) {
  // Show/hide panes
  document.querySelectorAll('.m-step-pane').forEach(p => p.classList.remove('active'));
  const active = document.getElementById('ms-step' + step);
  if (active) active.classList.add('active');

  // Update step indicator
  [1, 2, 3, 4].forEach(n => {
    const numEl = document.getElementById('msn' + n);
    const lblEl = document.getElementById('msl' + n);
    const line  = document.getElementById('msl-line' + n);
    if (!numEl) return;

    if (n < step) {
      numEl.className   = 'm-step-num done';
      numEl.textContent = '✓';
      if (lblEl) lblEl.className = 'm-step-lbl';
    } else if (n === step) {
      numEl.className   = 'm-step-num active';
      numEl.textContent = String(n);
      if (lblEl) lblEl.className = 'm-step-lbl active';
    } else {
      numEl.className   = 'm-step-num pending';
      numEl.textContent = String(n);
      if (lblEl) lblEl.className = 'm-step-lbl pending';
    }

    if (line) line.className = n < step ? 'm-step-line done' : 'm-step-line';
  });

  // Scroll to top of step content
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─── Confirm booking ───────────────────────────────────────
function mConfirmBooking() {
  // Switch to Upcoming tab
  const upcomingTab = document.querySelector('[onclick*="upcoming"]');
  if (upcomingTab) mTab(upcomingTab, 'upcoming');

  // Show success alert
  const alert = document.createElement('div');
  alert.className = 'm-alert m-alert-success';
  alert.style.cssText = 'margin: 12px 16px 0; animation: fadeInDown 0.3s ease;';
  alert.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
    <span><strong>Confirmed!</strong> You'll receive a confirmation email shortly.</span>
  `;
  const pane = document.getElementById('mt-upcoming');
  if (pane) pane.insertBefore(alert, pane.firstChild);
  setTimeout(() => { alert.style.opacity = '0'; alert.style.transition = 'opacity 0.4s'; setTimeout(() => alert.remove(), 400); }, 4500);
}

// ─── Notification dot ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.m-header__icon-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const dot = btn.querySelector('.m-notif-dot');
      if (dot) dot.style.display = 'none';
    });
  });
});

// ─── Smooth scroll for crisis anchor ──────────────────────
if (window.location.hash === '#crisis') {
  setTimeout(() => {
    const el = document.getElementById('crisis');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 200);
}

// Minimal fade-in keyframe via JS (avoids adding @keyframes everywhere)
const style = document.createElement('style');
style.textContent = `@keyframes fadeInDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:none; } }`;
document.head.appendChild(style);
