/* ============================================
   UCSC STUDENT HEALTH — MAIN JS
   ============================================ */

// ─── Tab Switcher ────────────────────────────
function switchTab(btn, id) {
  const container = btn.closest('.tabs');
  if (!container) return;

  // deactivate all buttons in this tab bar
  container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // hide all sibling panes
  const parent = container.parentElement;
  parent.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

  const pane = parent.querySelector('#tab-' + id);
  if (pane) pane.classList.add('active');
}

// ─── Resources Section Tabs ──────────────────
function switchResTab(btn, id) {
  const bar = btn.closest('.section-tab-bar');
  if (!bar) return;

  bar.querySelectorAll('.section-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  document.querySelectorAll('.res-pane').forEach(p => p.style.display = 'none');
  const pane = document.querySelector('#res-' + id);
  if (pane) pane.style.display = '';
}

// ─── Result Card Accordion ───────────────────
function toggleResult(id) {
  const card = document.getElementById(id);
  if (!card) return;
  card.classList.toggle('open');
}

// ─── Appointment Booking Steps ───────────────
function bookStep(step) {
  // Hide all steps
  [1, 2, 3, 4].forEach(n => {
    const el = document.getElementById('book-step' + n);
    if (el) el.style.display = 'none';
  });

  // Show current
  const current = document.getElementById('book-step' + step);
  if (current) current.style.display = '';

  // Update step indicator
  [1, 2, 3, 4].forEach(n => {
    const numEl   = document.getElementById('step' + n + '-num');
    const labelEl = document.getElementById('step' + n + '-label');
    if (!numEl) return;

    if (n < step) {
      numEl.className   = 'step-num done';
      numEl.textContent = '✓';
      if (labelEl) labelEl.className = 'step-label';
    } else if (n === step) {
      numEl.className   = 'step-num active';
      numEl.textContent = n;
      if (labelEl) labelEl.className = 'step-label active';
    } else {
      numEl.className   = 'step-num pending';
      numEl.textContent = n;
      if (labelEl) labelEl.className = 'step-label pending';
    }

    // Line between steps
    const line = document.getElementById('line' + n);
    if (line) {
      line.className = n < step ? 'step-line done' : 'step-line';
    }
  });
}

// ─── Appointment Type Selection ──────────────
function selectApptType(el) {
  el.closest('.card-pad-lg, .modal-body, form, div')
    .querySelectorAll('label.provider-card')
    .forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
}

// ─── Provider Selection ──────────────────────
function selectProvider(el) {
  const parent = el.closest('.provider-grid, [class*="provider-grid"]');
  if (parent) {
    parent.querySelectorAll('.provider-card').forEach(c => c.classList.remove('selected'));
  }
  el.classList.add('selected');
}

// ─── Time Slot Selection ─────────────────────
function selectTime(el) {
  if (el.classList.contains('unavailable')) return;
  const grid = el.closest('.time-grid');
  if (grid) grid.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
  el.classList.add('selected');
}

// ─── Modal ───────────────────────────────────
function openRescheduleModal() {
  const m = document.getElementById('rescheduleModal');
  if (m) m.classList.add('open');
}

function closeModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove('open');
}

// Close modal on overlay click
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
  }
});

// Close modal on ESC
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
  }
});

// ─── Booking Confirmation ────────────────────
function confirmBooking() {
  // Switch to upcoming tab with a brief animation
  const bookTab = document.querySelector('[onclick*="book"]');
  const upcomingTab = document.querySelector('[onclick*="upcoming"]');

  if (upcomingTab) {
    switchTab(upcomingTab, 'upcoming');
  }

  // Show success alert
  const successAlert = document.createElement('div');
  successAlert.className = 'alert alert-success';
  successAlert.style.cssText = 'animation: fadeIn 0.3s ease; margin-bottom: 16px;';
  successAlert.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
    <span><strong>Appointment confirmed!</strong> You'll receive a confirmation email shortly. A reminder will be sent 24 hours before your visit.</span>
  `;

  const tab = document.getElementById('tab-upcoming');
  if (tab) tab.insertBefore(successAlert, tab.firstChild);

  setTimeout(() => {
    successAlert.style.opacity = '0';
    successAlert.style.transition = 'opacity 0.5s';
    setTimeout(() => successAlert.remove(), 500);
  }, 5000);
}

// ─── Filter Chips ────────────────────────────
function toggleFilter(el) {
  const siblings = el.closest('.filter-bar').querySelectorAll('.filter-chip');
  siblings.forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}

// ─── Profile Dropdown ────────────────────────
function toggleProfileMenu() {
  const menu = document.getElementById('profileMenu');
  if (menu) menu.classList.toggle('open');
}

document.addEventListener('click', function(e) {
  const wrapper = document.getElementById('topnavProfile');
  const menu    = document.getElementById('profileMenu');
  if (menu && menu.classList.contains('open') && wrapper && !wrapper.contains(e.target)) {
    menu.classList.remove('open');
  }
});

// ─── Shared read-state (localStorage) ────────
// These are accessible to inline scripts on any page (e.g. messages.html).

// Notification n1 links to inbox thread t1, and vice versa.
const NOTIF_THREAD_MAP = { n1: 't1' };
const THREAD_NOTIF_MAP = { t1: 'n1' };
// The two threads that begin as unread on a fresh session.
const INITIALLY_UNREAD_THREADS = ['t1', 't2'];

function getReadNotifs()  { return JSON.parse(localStorage.getItem('ucsh_read_notifs')  || '[]'); }
function getReadThreads() { return JSON.parse(localStorage.getItem('ucsh_read_threads') || '[]'); }

function saveReadNotif(id) {
  const arr = getReadNotifs();
  if (arr.includes(id)) return;
  arr.push(id);
  localStorage.setItem('ucsh_read_notifs', JSON.stringify(arr));
  // Cross-link: mark the linked thread read too
  const tid = NOTIF_THREAD_MAP[id];
  if (tid) { const ta = getReadThreads(); if (!ta.includes(tid)) { ta.push(tid); localStorage.setItem('ucsh_read_threads', JSON.stringify(ta)); } }
  syncMsgBadges();
}

function saveReadThread(id) {
  const arr = getReadThreads();
  if (arr.includes(id)) return;
  arr.push(id);
  localStorage.setItem('ucsh_read_threads', JSON.stringify(arr));
  // Cross-link: mark the linked notification read too
  const nid = THREAD_NOTIF_MAP[id];
  if (nid) { const na = getReadNotifs(); if (!na.includes(nid)) { na.push(nid); localStorage.setItem('ucsh_read_notifs', JSON.stringify(na)); } }
  syncMsgBadges();
}

function unreadMsgCount() {
  const read = getReadThreads();
  return INITIALLY_UNREAD_THREADS.filter(id => !read.includes(id)).length;
}

// Updates every unread-count indicator on the current page.
function syncMsgBadges() {
  const count = unreadMsgCount();

  // Profile menu "Messages" badge
  const profileLink = document.querySelector('.profile-menu a[href="messages.html"]');
  if (profileLink) {
    let b = profileLink.querySelector('.profile-menu__badge');
    if (count > 0) {
      if (!b) { b = document.createElement('span'); b.className = 'profile-menu__badge'; profileLink.appendChild(b); }
      b.textContent = count; b.style.display = '';
    } else if (b) { b.style.display = 'none'; }
  }

  // Dashboard quick-action card badge (#msgCardBadge)
  const cardBadge = document.getElementById('msgCardBadge');
  if (cardBadge) {
    if (count > 0) {
      cardBadge.textContent = count + ' new';
      cardBadge.style.cssText = 'margin-left:4px;font-size:0.6rem;';
      cardBadge.className = 'badge badge-blue';
    } else {
      cardBadge.textContent = 'All caught up';
      cardBadge.style.cssText = 'margin-left:4px;font-size:0.6rem;background:#dcfce7;color:#166534;border-radius:99px;padding:2px 8px;font-weight:600;';
      cardBadge.className = '';
    }
  }

  // Bell dot visibility (handles both .notif-dot and .m-notif-dot)
  const readNotifs = getReadNotifs();
  const bellHasUnread = NOTIFICATIONS.some(n => !readNotifs.includes(n.id));
  document.querySelectorAll('.notif-dot, .m-notif-dot').forEach(dot => {
    dot.style.display = bellHasUnread ? '' : 'none';
  });
}

// ─── Notification Bell ───────────────────────
// NOTIFICATIONS must be module-level so syncMsgBadges() can reference it.
const NOTIFICATIONS = [
    {
      id: 'n1', unread: true,
      icon: '💬', iconBg: '#EBF5FF',
      title: 'New message from Dr. Kim',
      text: 'Your Vitamin D lab results are in. Overall looking good…',
      time: '10 min ago',
      href: 'messages.html'
    },
    {
      id: 'n2', unread: true,
      icon: '📋', iconBg: '#FFF7E6',
      title: 'Form due before your visit',
      text: 'Please complete the Pre-Visit Form for your April 15 appointment.',
      time: '2 hrs ago',
      href: 'forms.html'
    },
    {
      id: 'n3', unread: false,
      icon: '📅', iconBg: '#F0F7F0',
      title: 'Appointment reminder',
      text: 'General check-up with Dr. Sarah Kim on April 15 at 10:00 AM.',
      time: 'Yesterday',
      href: 'appointments.html'
    },
    {
      id: 'n4', unread: false,
      icon: '🧪', iconBg: '#F5F0FF',
      title: 'Lab results available',
      text: 'Your Complete Blood Count results are now ready to view.',
      time: '2 days ago',
      href: 'results.html'
    },
    {
      id: 'n5', unread: false,
      icon: '💳', iconBg: '#FFF0F0',
      title: 'Payment reminder',
      text: 'You have an outstanding balance of $40.00 on your account.',
      time: '3 days ago',
      href: 'billing.html'
    }
  ];

// Build dropdown HTML fresh each time (always reflects current localStorage state).
function buildNotifMenu() {
  const readNotifs = getReadNotifs();
  const unreadCount = NOTIFICATIONS.filter(n => !readNotifs.includes(n.id)).length;
  const items = NOTIFICATIONS.map(n => {
    const isUnread = !readNotifs.includes(n.id);
    return `
    <a class="notif-item${isUnread ? ' notif-item--unread' : ''}" href="${n.href}" data-notif-id="${n.id}">
      <span class="notif-item__icon" style="background:${n.iconBg}">${n.icon}</span>
      <span class="notif-item__body">
        <span class="notif-item__title">${n.title}</span>
        <span class="notif-item__text">${n.text}</span>
        <span class="notif-item__time">${n.time}</span>
      </span>
      ${isUnread ? '<span class="notif-item__dot"></span>' : ''}
    </a>`;
  }).join('');

  return `
    <div class="notif-menu" role="dialog" aria-label="Notifications">
      <div class="notif-menu__hd">
        <span class="notif-menu__title">Notifications${unreadCount > 0 ? ` <span class="notif-badge">${unreadCount}</span>` : ''}</span>
        ${unreadCount > 0 ? '<button class="notif-menu__mark" onclick="markAllNotifRead()">Mark all read</button>' : ''}
      </div>
      <div class="notif-menu__list">${items}</div>
      <div class="notif-menu__footer"><a href="#">View all notifications</a></div>
    </div>`;
}

function attachNotifItemHandlers(wrap) {
  wrap.querySelectorAll('.notif-item[data-notif-id]').forEach(item => {
    item.addEventListener('click', function() {
      const nid = this.getAttribute('data-notif-id');
      saveReadNotif(nid);
      this.classList.remove('notif-item--unread');
      const dot = this.querySelector('.notif-item__dot');
      if (dot) dot.remove();
      const remaining = wrap.querySelectorAll('.notif-item--unread').length;
      const badge = wrap.querySelector('.notif-badge');
      if (badge) { if (remaining > 0) badge.textContent = remaining; else badge.remove(); }
      const markBtn = wrap.querySelector('.notif-menu__mark');
      if (markBtn && remaining === 0) markBtn.style.display = 'none';
    });
  });
}

function wrapBell(bell) {
  if (bell.closest('.topnav__notif-wrap')) return;
  const wrap = document.createElement('div');
  wrap.className = 'topnav__notif-wrap';
  bell.parentNode.insertBefore(wrap, bell);
  wrap.appendChild(bell);

  bell.addEventListener('click', function(e) {
    e.stopPropagation();
    const existing = wrap.querySelector('.notif-menu');
    const wasOpen  = existing && existing.classList.contains('open');
    if (existing) existing.remove();
    wrap.insertAdjacentHTML('beforeend', buildNotifMenu());
    attachNotifItemHandlers(wrap);
    const profileMenu = document.getElementById('profileMenu');
    if (profileMenu) profileMenu.classList.remove('open');
    if (!wasOpen) wrap.querySelector('.notif-menu').classList.add('open');
  });
}

function closeAllNotifMenus() {
  document.querySelectorAll('.notif-menu.open').forEach(m => m.classList.remove('open'));
}

document.addEventListener('click', function(e) {
  if (!e.target.closest('.topnav__notif-wrap')) closeAllNotifMenus();
});
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeAllNotifMenus();
});

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.topnav__notif').forEach(wrapBell);
  syncMsgBadges();
});

function markAllNotifRead() {
  NOTIFICATIONS.forEach(n => saveReadNotif(n.id));
  const openMenu = document.querySelector('.notif-menu.open');
  if (openMenu) {
    const wrap = openMenu.closest('.topnav__notif-wrap');
    openMenu.remove();
    if (wrap) { wrap.insertAdjacentHTML('beforeend', buildNotifMenu()); attachNotifItemHandlers(wrap); wrap.querySelector('.notif-menu').classList.add('open'); }
  }
  syncMsgBadges();
}

// ─── Smooth scroll for #urgent anchor ────────
if (window.location.hash === '#urgent') {
  setTimeout(() => {
    const el = document.getElementById('urgent');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 200);
}
