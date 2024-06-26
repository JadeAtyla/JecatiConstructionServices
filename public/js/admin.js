const { response } = require("express");

function showSection(sectionId) {
    // Hide all content sections
    const sections = document.querySelectorAll('.content');
    sections.forEach(section => section.classList.remove('active'));

    // Show the selected section
    const activeSection = document.getElementById(sectionId);
    activeSection.classList.add('active');
}

showSection('profile');

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

    editButton.addEventListener('click', function() {
        profileInputs.forEach(input => {
            input.removeAttribute('disabled');
        });


        saveButton.style.display = 'inline-block';
        cancelButton.style.display = 'inline-block';
        editButton.style.display = 'none';
    });

    saveButton.addEventListener('click', function() {
        profileInputs.forEach(input => {
            input.setAttribute('disabled', 'true');
        });

        saveButton.style.display = 'none';
        cancelButton.style.display = 'none';
        editButton.style.display = 'inline-block';
    });

    cancelButton.addEventListener('click', function() {
        // Reset input fields to their original values
        profileInputs.forEach(input => {
            input.setAttribute('disabled', 'true');
        });

        saveButton.style.display = 'none';
        cancelButton.style.display = 'none';
        editButton.style.display = 'inline-block';
    });

    window.showSection = showSection;
});