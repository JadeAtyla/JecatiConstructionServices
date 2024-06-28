function showSection(sectionId) {
    // Hide all content sections
    const sections = document.querySelectorAll('.content');
    sections.forEach(section => section.classList.remove('active'));

    // Show the selected section
    const activeSection = document.getElementById(sectionId);
    activeSection.classList.add('active');
}

showSection('transactions');

function saveChanges() {
    alert("Changes saved successfully!");
}

function cancelChanges() {
    showSection('profile');
}

document.addEventListener("DOMContentLoaded", function() {
    function showSection(sectionId) {
        const sections = document.getElementsByClassName('content');
        for (let section of sections) {
            section.style.display = 'none';
        }
        
        const sectionToShow = document.getElementById(sectionId);
        if (sectionToShow) {
            sectionToShow.style.display = 'block';
        }
    }

    showSection('profile');

    // Edit button functionality for profile section
    const editButton = document.getElementById('edit');
    const saveButton = document.getElementById('save');
    const cancelButton = document.getElementById('cancel');
    const profileInputs = document.querySelectorAll('#profile .form-group input');
    const changePassword = document.getElementsByClassName('change-password');
    const passwords = document.getElementsByClassName('passwords');
    const passwordField = document.getElementsByClassName('password-field');
    const confirmPasswordPopup = document.getElementsByClassName('confirm-password-popup');

    function checkPasswordFieldValues(passwordField) {
        if (passwordField[0].value.length != 0  | passwordField[1].value.length != 0  | passwordField[2].value.length != 0 ) {
                confirmPasswordPopup[0].style.display = 'inline-block';         
        }
    }
    
    editButton.addEventListener('click', function() {
        profileInputs.forEach(input => {
            input.removeAttribute('disabled');
        });
        passwords[0].style.display = 'inline-block';
        saveButton.style.display = 'inline-block';
        cancelButton.style.display = 'inline-block';
        editButton.style.display = 'none';
    });

    saveButton.addEventListener('click', function() {

        profileInputs.forEach(input => {
            input.setAttribute('disabled', 'true');
        });
        checkPasswordFieldValues(passwordField);
        passwords[0].style.display = 'none';
        saveButton.style.display = 'none';
        cancelButton.style.display = 'none';
        editButton.style.display = 'inline-block';
    });

    cancelButton.addEventListener('click', function() {
        // Reset input fields to their original values
        profileInputs.forEach(input => {
            input.setAttribute('disabled', 'true');
        });
        passwords[0].style.display = 'none';
        saveButton.style.display = 'none';
        cancelButton.style.display = 'none';
        editButton.style.display = 'inline-block';
    });

    window.showSection = showSection;
});

function confirmLogout(event) {
    event.preventDefault(); // Prevent form submission initially

    if (confirm("Are you sure you want to log out?")) {
        document.getElementById("logoutForm").submit(); // Submit the form if confirmed
    } else {
        // Do nothing or handle cancel action
        console.log("Logout cancelled.");
    }
}

