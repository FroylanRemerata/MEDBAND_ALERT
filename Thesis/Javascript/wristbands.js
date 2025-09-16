

document.addEventListener('DOMContentLoaded', function() {

    initializeWristbands();
});

function initializeWristbands() {

    const searchInput = document.querySelector('.search input');
    

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchWristbands(this.value);
        });
    }
    

    initializeBatteryIndicators();
}

function searchWristbands(searchTerm) {
    const tableRows = document.querySelectorAll('.wristbands-table tbody tr');
    
    tableRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm.toLowerCase())) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function initializeBatteryIndicators() {
    const batteryBars = document.querySelectorAll('.battery-fill');
    
    batteryBars.forEach(bar => {
        const percentage = parseInt(bar.style.width);
        

        bar.classList.remove('high', 'mid', 'low');
        
        if (percentage >= 70) {
            bar.classList.add('high');
        } else if (percentage >= 30) {
            bar.classList.add('mid');
        } else {
            bar.classList.add('low');
        }
    });
}

function updateWristbandStatus(wristbandId, newStatus) {
    const tableRows = document.querySelectorAll('.wristbands-table tbody tr');
    
    tableRows.forEach(row => {
        const wristbandCell = row.querySelector('td:first-child');
        if (wristbandCell && wristbandCell.textContent === wristbandId) {
            const statusCell = row.querySelector('.status');
            if (statusCell) {
                statusCell.textContent = newStatus;
                statusCell.className = `status ${newStatus.toLowerCase()}`;
            }
        }
    });
}

function updateBatteryLevel(wristbandId, newLevel) {
    const tableRows = document.querySelectorAll('.wristbands-table tbody tr');
    
    tableRows.forEach(row => {
        const wristbandCell = row.querySelector('td:first-child');
        if (wristbandCell && wristbandCell.textContent === wristbandId) {
            const batteryFill = row.querySelector('.battery-fill');
            const batteryText = row.querySelector('.battery');
            
            if (batteryFill && batteryText) {
                batteryFill.style.width = `${newLevel}%`;
                

                batteryFill.classList.remove('high', 'mid', 'low');
                if (newLevel >= 70) {
                    batteryFill.classList.add('high');
                } else if (newLevel >= 30) {
                    batteryFill.classList.add('mid');
                } else {
                    batteryFill.classList.add('low');
                }
                

                const textNode = batteryText.childNodes[batteryText.childNodes.length - 1];
                if (textNode) {
                    textNode.textContent = `${newLevel}%`;
                }
            }
        }
    });
}

function assignWristbandToPatient(wristbandId, patientId) {
    const tableRows = document.querySelectorAll('.wristbands-table tbody tr');
    
    tableRows.forEach(row => {
        const wristbandCell = row.querySelector('td:first-child');
        if (wristbandCell && wristbandCell.textContent === wristbandId) {
            const patientIdCell = row.querySelector('td:last-child');
            if (patientIdCell) {
                patientIdCell.textContent = patientId;
            }
            

            const statusCell = row.querySelector('.status');
            if (statusCell) {
                statusCell.textContent = 'Active';
                statusCell.className = 'status active';
            }
        }
    });
}

function unassignWristband(wristbandId) {
    const tableRows = document.querySelectorAll('.wristbands-table tbody tr');
    
    tableRows.forEach(row => {
        const wristbandCell = row.querySelector('td:first-child');
        if (wristbandCell && wristbandCell.textContent === wristbandId) {
            const patientIdCell = row.querySelector('td:last-child');
            if (patientIdCell) {
                patientIdCell.textContent = '-';
            }
            

            const statusCell = row.querySelector('.status');
            if (statusCell) {
                statusCell.textContent = 'Inactive';
                statusCell.className = 'status inactive';
            }
        }
    });
}


window.WristbandsModule = {
    searchWristbands,
    updateWristbandStatus,
    updateBatteryLevel,
    assignWristbandToPatient,
    unassignWristband
};
