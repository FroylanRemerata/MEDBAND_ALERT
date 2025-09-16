
function initializeCharts() {
  console.log("✅ Initializing charts...");


  const mainContent = document.querySelector('.main-content');
  if (mainContent) {
    mainContent.style.padding = '20px';
  }


  if (typeof Chart === 'undefined') {
    console.error('Chart.js is not loaded');
    return;
  }


  const bitesCtx = document.getElementById('bitesChart');
  if (bitesCtx) {
    console.log("Creating bites chart...");
    new Chart(bitesCtx, {
      type: 'bar',
      data: {
        labels: ['April', 'May', 'June', 'July', 'August', 'September', 'October'],
        datasets: [{
          label: 'Bites',
          data: [8, 12, 16, 20, 20, 25, 23],
          backgroundColor: [
            'rgba(61,124,166,0.7)',
            'rgba(61,124,166,0.8)',
            'rgba(61,124,166,0.9)',
            'rgba(61,124,166,1)',
            'rgba(61,124,166,1)',
            'rgba(61,124,166,1)',
            'rgba(61,124,166,0.9)'
          ],
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 25,
            ticks: {
              stepSize: 5
            }
          }
        }
      }
    });
  } else {
    console.error('bitesChart canvas not found');
  }


  const vaccineCtx = document.getElementById('vaccineChart');
  if (vaccineCtx) {
    console.log("Creating vaccine chart...");
    new Chart(vaccineCtx, {
      type: 'doughnut',
      data: {
        labels: ['Anti-Rabies', 'Tetanus'],
        datasets: [{
          data: [10, 4],
          backgroundColor: ['rgba(61,124,166,0.7)', 'rgba(61,124,166,1)']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { 
            position: 'bottom',
            labels: {
              usePointStyle: true,
              padding: 20
            }
          }
        }
      }
    });
  } else {
    console.error('vaccineChart canvas not found');
  }


  const wristbandCtx = document.getElementById('wristbandChart');
  if (wristbandCtx) {
    console.log("Creating wristband chart...");
    new Chart(wristbandCtx, {
      type: 'pie',
      data: {
        labels: ['Active', 'Inactive'],
        datasets: [{
          data: [20, 4],
          backgroundColor: ['#4caf50', '#f44336']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { 
            position: 'bottom',
            labels: {
              usePointStyle: true,
              padding: 20
            }
          }
        }
      }
    });
  } else {
    console.error('wristbandChart canvas not found');
  }
}


document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Dashboard script loaded");
  initializeCharts();
});
