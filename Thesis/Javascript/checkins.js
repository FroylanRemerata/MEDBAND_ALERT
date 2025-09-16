

function setupScanModal() {
    var scanBtn = document.querySelector('.scan-btn');
    if (!scanBtn) return;
    var modal = document.querySelector('.scan-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'scan-modal';
        modal.innerHTML = '<div class="scan-modal-content">Please scan the wristband.....</div>';
        modal.style.display = 'none';
        document.body.appendChild(modal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    scanBtn.addEventListener('click', function() {
        modal.style.display = 'flex';
    });
}


if (window.location.pathname.endsWith('index.html')) {
    const observer = new MutationObserver(() => {
        setupScanModal();
    });
    observer.observe(document.getElementById('main-content'), { childList: true, subtree: true });

    setupScanModal();
} else {

    window.addEventListener('DOMContentLoaded', setupScanModal);
}
