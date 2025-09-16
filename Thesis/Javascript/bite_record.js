
(function () {
  function $(s, r) { return (r || document).querySelector(s); }
  function $all(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  function open(modal) {
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function close(modal) {
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function populateFromRow(row) {
    var tds = row.querySelectorAll('td');
    var data = {
      '#m-id': tds[0] ? tds[0].textContent.trim() : 'N/A',
      '#m-name': tds[1] ? tds[1].textContent.trim() : 'N/A',
      '#m-contact': tds[2] ? tds[2].textContent.trim() : 'N/A',
      '#m-address': tds[3] ? tds[3].textContent.trim() : 'N/A',
      '#m-wristband': tds[4] ? tds[4].textContent.trim() : 'N/A',
      '#m-date': tds[5] ? tds[5].textContent.trim() : 'N/A'
    };
    Object.keys(data).forEach(function (sel) { var el = $(sel); if (el) el.textContent = data[sel]; });
  }

  function init() {
    var modal = $('#patientModal');
    if (!modal) return;

    $all('.records-table .btn-view').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        var row = e.currentTarget.closest('tr');
        populateFromRow(row);
        open(modal);
      });
    });

    $all('[data-close]', modal).forEach(function (el) { el.addEventListener('click', function () { close(modal); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') close(modal); });


    var registerBtn = document.querySelector('.btn.btn-register');
    if (registerBtn) {
      registerBtn.addEventListener('click', function () {

        if (typeof window.loadPage === 'function') {
          var registerMenuItem = document.querySelector('.menu li:nth-child(3)') || document.querySelector('.menu li');
          window.loadPage('pages/register.html', registerMenuItem);
        } else {

          window.location.href = 'register.html';
        }
      });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();


