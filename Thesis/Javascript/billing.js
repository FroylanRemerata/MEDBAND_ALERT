

document.addEventListener('DOMContentLoaded', function() {

    initializeBilling();
});

function initializeBilling() {

    const patientSelect = document.getElementById('patientSelect');
    const amountInput = document.getElementById('amountInput');
    const createBillBtn = document.querySelector('.create-bill-btn');
    const markPaidBtns = document.querySelectorAll('.mark-paid-btn');
    

    createBillBtn.addEventListener('click', function() {
        createNewBill();
    });
    

    markPaidBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            markBillAsPaid(this);
        });
    });
    

    amountInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            createNewBill();
        }
    });
}

function createNewBill() {
    const patientSelect = document.getElementById('patientSelect');
    const amountInput = document.getElementById('amountInput');
    
    const selectedPatient = patientSelect.value;
    const amount = parseFloat(amountInput.value);
    

    if (!selectedPatient) {
        alert('Please select a patient');
        return;
    }
    
    if (isNaN(amount) || amount < 0) {
        alert('Please enter a valid amount');
        return;
    }
    

    const newBillId = generateBillId();
    

    const newBill = {
        id: newBillId,
        patient: selectedPatient,
        amount: amount,
        date: new Date().toISOString().split('T')[0],
        status: 'unpaid'
    };
    

    addToRecentBills(newBill);
    

    addToBillingHistory(newBill);
    

    amountInput.value = '';
    

    showNotification('Bill created successfully!', 'success');
}

function generateBillId() {

    const existingIds = Array.from(document.querySelectorAll('.bill-id'))
        .map(el => parseInt(el.textContent.split(': ')[1]))
        .filter(id => !isNaN(id));
    
    const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
    return String(maxId + 1).padStart(2, '0');
}

function addToRecentBills(bill) {
    const billsList = document.querySelector('.bills-list');
    

    const billItem = document.createElement('div');
    billItem.className = 'bill-item';
    billItem.innerHTML = `
        <div class="bill-info">
            <div class="bill-id">ID: ${bill.id}</div>
            <div class="bill-amount">₱ ${bill.amount}</div>
            <div class="bill-date">${bill.date}</div>
        </div>
        <div class="bill-actions">
            <span class="status ${bill.status}">${bill.status === 'paid' ? 'Paid' : 'Unpaid'}</span>
            ${bill.status === 'unpaid' ? '<button class="mark-paid-btn">Mark Paid</button>' : ''}
        </div>
    `;
    

    const markPaidBtn = billItem.querySelector('.mark-paid-btn');
    if (markPaidBtn) {
        markPaidBtn.addEventListener('click', function() {
            markBillAsPaid(this);
        });
    }
    

    billsList.insertBefore(billItem, billsList.firstChild);
    

    const billItems = billsList.querySelectorAll('.bill-item');
    if (billItems.length > 4) {
        billsList.removeChild(billItems[billItems.length - 1]);
    }
}

function addToBillingHistory(bill) {
    const tableBody = document.querySelector('.billing-table tbody');
    

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${bill.id}</td>
        <td>${getPatientName(bill.patient)}</td>
        <td>₱ ${bill.amount}</td>
        <td><span class="status-text ${bill.status}">${bill.status === 'paid' ? 'Paid' : 'Unpaid'}</span></td>
        <td>${bill.date}</td>
    `;
    

    tableBody.insertBefore(newRow, tableBody.firstChild);
}

function markBillAsPaid(button) {
    const billItem = button.closest('.bill-item');
    const statusSpan = billItem.querySelector('.status');
    const billId = billItem.querySelector('.bill-id').textContent.split(': ')[1];
    

    statusSpan.textContent = 'Paid';
    statusSpan.className = 'status paid';
    button.remove();
    

    const tableRows = document.querySelectorAll('.billing-table tbody tr');
    tableRows.forEach(row => {
        const idCell = row.querySelector('td:first-child');
        if (idCell && idCell.textContent === billId) {
            const statusCell = row.querySelector('.status-text');
            statusCell.textContent = 'Paid';
            statusCell.className = 'status-text paid';
        }
    });
    
    showNotification('Bill marked as paid!', 'success');
}

function getPatientName(patientId) {
    const patientNames = {
        '01': 'Carlos Agasin',
        '02': 'Maria Santos',
        '03': 'Juan Dela Cruz'
    };
    return patientNames[patientId] || 'Unknown Patient';
}

function showNotification(message, type = 'info') {

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 6px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    

    if (type === 'success') {
        notification.style.backgroundColor = '#28a745';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#dc3545';
    } else {
        notification.style.backgroundColor = '#007bff';
    }
    

    document.body.appendChild(notification);
    

    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}


function formatCurrency(amount) {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP'
    }).format(amount);
}


function searchBills(searchTerm) {
    const tableRows = document.querySelectorAll('.billing-table tbody tr');
    
    tableRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm.toLowerCase())) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}


window.BillingModule = {
    createNewBill,
    markBillAsPaid,
    searchBills,
    showNotification
};
