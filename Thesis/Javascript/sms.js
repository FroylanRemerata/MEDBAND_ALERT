

document.addEventListener('DOMContentLoaded', function() {

    initializeSMS();
});

function initializeSMS() {

    const patientSelect = document.getElementById('patientSelect');
    const messageTypeSelect = document.getElementById('messageType');
    const customMessageTextarea = document.getElementById('customMessage');
    const sendBtn = document.querySelector('.send-notification-btn');
    

    sendBtn.addEventListener('click', function() {
        sendNewNotification();
    });
    

    messageTypeSelect.addEventListener('change', function() {
        generateMessageTemplate();
    });
    

    customMessageTextarea.addEventListener('keypress', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            sendNewNotification();
        }
    });
}

function sendNewNotification() {
    const patientSelect = document.getElementById('patientSelect');
    const messageTypeSelect = document.getElementById('messageType');
    const customMessageTextarea = document.getElementById('customMessage');
    const sendBtn = document.querySelector('.send-notification-btn');
    
    const selectedPatient = patientSelect.value;
    const messageType = messageTypeSelect.value;
    const customMessage = customMessageTextarea.value.trim();
    

    if (!selectedPatient) {
        showNotification('Please select a patient', 'error');
        return;
    }
    
    if (!customMessage) {
        showNotification('Please enter a message', 'error');
        return;
    }
    

    sendBtn.textContent = 'Sending...';
    sendBtn.disabled = true;
    sendBtn.classList.add('loading');
    

    setTimeout(() => {

        const newNotification = {
            id: generateNotificationId(),
            patientId: selectedPatient,
            patientName: getPatientName(selectedPatient),
            message: customMessage,
            type: messageType,
            date: new Date().toISOString().split('T')[0],
            status: 'sent'
        };
        

        addNotificationCard(newNotification);
        

        patientSelect.value = '';
        messageTypeSelect.value = 'reminder';
        customMessageTextarea.value = '';
        

        sendBtn.textContent = 'Send Notification';
        sendBtn.disabled = false;
        sendBtn.classList.remove('loading');
        

        showNotification('Notification sent successfully!', 'success');
    }, 1500);
}

function generateMessageTemplate() {
    const messageTypeSelect = document.getElementById('messageType');
    const customMessageTextarea = document.getElementById('customMessage');
    
    const templates = {
        'reminder': 'Reminder: Please visit the clinic for your scheduled appointment.',
        'appointment': 'Your appointment is scheduled for tomorrow at 10:00 AM. Please arrive 15 minutes early.',
        'medication': 'Medication reminder: Please take your prescribed medication as directed.',
        'vaccination': 'Vaccination reminder: Your next vaccination is due soon. Please schedule an appointment.',
        'followup': 'Follow-up reminder: Please visit the clinic for your follow-up appointment.'
    };
    
    const template = templates[messageTypeSelect.value];
    if (template && !customMessageTextarea.value) {
        customMessageTextarea.value = template;
    }
}

function addNotificationCard(notification) {
    const notificationsContainer = document.querySelector('.notifications-container');
    

    const notificationCard = document.createElement('div');
    notificationCard.className = 'notification-card new';
    notificationCard.innerHTML = `
        <div class="patient-id">To Patient ID: ${notification.patientId}</div>
        <div class="notification-message">${notification.message}</div>
        <div class="notification-date">${notification.date}</div>
        <div class="notification-actions">
            <button class="resend-btn" onclick="resendNotification('${notification.id}')">Resend</button>
            <button class="delete-btn" onclick="deleteNotification('${notification.id}')">Delete</button>
        </div>
    `;
    

    notificationsContainer.insertBefore(notificationCard, notificationsContainer.firstChild);
    

    setTimeout(() => {
        notificationCard.classList.remove('new');
    }, 500);
}

function resendNotification(notificationId) {

    const notificationCards = document.querySelectorAll('.notification-card');
    const targetCard = Array.from(notificationCards).find(card => 
        card.querySelector('.resend-btn').onclick.toString().includes(notificationId)
    );
    
    if (targetCard) {
        const resendBtn = targetCard.querySelector('.resend-btn');
        resendBtn.textContent = 'Resending...';
        resendBtn.disabled = true;
        

        setTimeout(() => {
            resendBtn.textContent = 'Resend';
            resendBtn.disabled = false;
            showNotification('Notification resent successfully!', 'success');
        }, 1000);
    }
}

function deleteNotification(notificationId) {

    const notificationCards = document.querySelectorAll('.notification-card');
    const targetCard = Array.from(notificationCards).find(card => 
        card.querySelector('.delete-btn').onclick.toString().includes(notificationId)
    );
    
    if (targetCard) {

        targetCard.style.opacity = '0';
        targetCard.style.transform = 'translateX(-20px)';
        targetCard.style.transition = 'all 0.3s ease';
        

        setTimeout(() => {
            if (targetCard.parentNode) {
                targetCard.parentNode.removeChild(targetCard);
            }
            showNotification('Notification deleted', 'info');
        }, 300);
    }
}

function generateNotificationId() {

    const existingIds = Array.from(document.querySelectorAll('.patient-id'))
        .map(el => parseInt(el.textContent.split(': ')[1]))
        .filter(id => !isNaN(id));
    
    const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
    return String(maxId + 1).padStart(2, '0');
}

function getPatientName(patientId) {
    const patientNames = {
        '01': 'Carlos Agasin',
        '02': 'Maria Santos',
        '03': 'Juan Dela Cruz',
        '04': 'Ana Rodriguez',
        '05': 'Pedro Martinez',
        '06': 'Sofia Garcia'
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
        font-family: 'Poppins', sans-serif;
    `;
    

    if (type === 'success') {
        notification.style.backgroundColor = '#28a745';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#dc3545';
    } else if (type === 'info') {
        notification.style.backgroundColor = '#17a2b8';
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


function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}


function searchNotifications(searchTerm) {
    const notificationCards = document.querySelectorAll('.notification-card');
    
    notificationCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(searchTerm.toLowerCase())) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}


function filterNotificationsByType(type) {
    const notificationCards = document.querySelectorAll('.notification-card');
    
    notificationCards.forEach(card => {
        if (type === 'all' || card.textContent.toLowerCase().includes(type.toLowerCase())) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}


window.SMSModule = {
    sendNewNotification,
    resendNotification,
    deleteNotification,
    searchNotifications,
    filterNotificationsByType,
    showNotification
};
