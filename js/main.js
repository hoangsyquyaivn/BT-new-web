/**
 * BITTRAIN INTERACTIVE LOGIC
 * File: BT_new_web/js/main.js
 * Xử lý: Mobile Menu, Bộ lọc lịch khai giảng (BT-14), Modal đăng ký (BT-16), Form Validate
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initRegistrationModal();
  initScheduleFilter();
  initTabs();
});

/**
 * 1. Mobile Menu Toggle
 */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.bt-menu-toggle');
  const nav = document.querySelector('.bt-nav');

  if (toggleBtn && nav) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('bt-nav--open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
      toggleBtn.innerHTML = isOpen ? '&#10005;' : '&#9776;';
    });

    // Đóng menu khi click vào bất kỳ link nào
    nav.querySelectorAll('.bt-nav__link').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('bt-nav--open');
        toggleBtn.innerHTML = '&#9776;';
      });
    });
  }
}

/**
 * 2. Registration Modal Logic (BT-16)
 * Cho phép mở popup từ bất kỳ nút "Đăng ký" nào và tự điền tên khóa học
 */
function initRegistrationModal() {
  const backdrop = document.getElementById('registrationModal');
  const closeBtn = document.querySelector('.bt-modal-close');
  const courseInput = document.getElementById('modalCourseName');
  const form = document.getElementById('modalRegisterForm');
  const successBox = document.getElementById('modalSuccessBox');

  // Gán sự kiện cho tất cả các nút có class .js-open-modal
  document.querySelectorAll('.js-open-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const courseName = btn.getAttribute('data-course') || 'Tư vấn tổng quan chương trình';
      if (courseInput) {
        courseInput.value = courseName;
      }
      if (backdrop) {
        backdrop.classList.add('bt-modal-backdrop--active');
        backdrop.setAttribute('aria-hidden', 'false');
        if (successBox) successBox.style.display = 'none';
        if (form) form.style.display = 'block';
      }
    });
  });

  // Đóng modal
  if (closeBtn && backdrop) {
    closeBtn.addEventListener('click', () => {
      closeModal();
    });

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && backdrop.classList.contains('bt-modal-backdrop--active')) {
        closeModal();
      }
    });
  }

  function closeModal() {
    backdrop.classList.remove('bt-modal-backdrop--active');
    backdrop.setAttribute('aria-hidden', 'true');
  }

  // Xử lý gửi biểu mẫu đăng ký
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('[name="fullname"]')?.value.trim();
      const phone = form.querySelector('[name="phone"]')?.value.trim();
      const email = form.querySelector('[name="email"]')?.value.trim();

      if (!name || !phone || !email) {
        alert('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Email!');
        return;
      }

      // Giả lập gửi thành công (BT-16)
      if (successBox) {
        successBox.style.display = 'block';
        successBox.innerHTML = `
          <strong>Đăng ký thành công!</strong><br>
          Cảm ơn bạn <b>${name}</b> đã quan tâm đến BitTrain. Chuyên viên cố vấn sẽ liên hệ lại qua số <b>${phone}</b> trong thời gian sớm nhất.
        `;
      }
      form.reset();
      form.style.display = 'none';

      setTimeout(() => {
        closeModal();
        if (form) form.style.display = 'block';
        if (successBox) successBox.style.display = 'none';
      }, 4000);
    });
  }
}

/**
 * 3. Schedule Filter Logic (BT-14 & BT-01)
 */
function initScheduleFilter() {
  const categorySelect = document.getElementById('filterCategory');
  const formatSelect = document.getElementById('filterFormat');
  const resetBtn = document.getElementById('filterReset');
  const rows = document.querySelectorAll('.js-schedule-row');
  const emptyNotice = document.getElementById('scheduleEmptyNotice');

  if (!categorySelect && !formatSelect) return;

  function filterSchedule() {
    const selectedCategory = categorySelect ? categorySelect.value : 'all';
    const selectedFormat = formatSelect ? formatSelect.value : 'all';
    let visibleCount = 0;

    rows.forEach(row => {
      const rowCategory = row.getAttribute('data-category');
      const rowFormat = row.getAttribute('data-format');

      const matchCategory = (selectedCategory === 'all' || rowCategory === selectedCategory);
      const matchFormat = (selectedFormat === 'all' || rowFormat === selectedFormat);

      if (matchCategory && matchFormat) {
        row.style.display = '';
        visibleCount++;
      } else {
        row.style.display = 'none';
      }
    });

    if (emptyNotice) {
      emptyNotice.style.display = (visibleCount === 0) ? 'block' : 'none';
    }
  }

  if (categorySelect) categorySelect.addEventListener('change', filterSchedule);
  if (formatSelect) formatSelect.addEventListener('change', filterSchedule);

  if (resetBtn) {
    resetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (categorySelect) categorySelect.value = 'all';
      if (formatSelect) formatSelect.value = 'all';
      filterSchedule();
    });
  }
}

/**
 * 4. Tab Switcher
 */
function initTabs() {
  const tabBtns = document.querySelectorAll('.js-tab-btn');
  const tabPanels = document.querySelectorAll('.js-tab-panel');

  if (tabBtns.length === 0) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');

      tabBtns.forEach(b => b.classList.remove('bt-btn--primary'));
      tabBtns.forEach(b => b.classList.add('bt-btn--outline'));
      btn.classList.remove('bt-btn--outline');
      btn.classList.add('bt-btn--primary');

      tabPanels.forEach(panel => {
        if (panel.id === target) {
          panel.style.display = 'block';
        } else {
          panel.style.display = 'none';
        }
      });
    });
  });
}
