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
    const passwords = document.getElementsByClassName('passwords');
    const passwordField = document.getElementsByClassName('password-field');
    const confirmPasswordPopup = document.getElementsByClassName('confirm-password-popup');

    const confirmPasswordButtonsOK = document.getElementsByClassName('confirm-password-ok');
    const confirmPasswordButtonsCancel = document.getElementsByClassName('confirm-password-cancel');

    const editProfileSuccess = document.getElementsByClassName('edit-profile-success');
    const editProfileSuccessOK = document.getElementsByClassName('edit-profile-success-ok');
    
    const incompleteFieldPopup = document.getElementsByClassName('incomplete-field-popup');
    const incompleteFieldOK = document.getElementsByClassName('incomplete-field-ok');

    const noChangesPopup = document.getElementsByClassName('no-changes-popup');
    const noChangesOK = document.getElementsByClassName('no-changes-ok');


    confirmPasswordButtonsOK[0].addEventListener('click', function() {
    /**  if (passwordField[0] !== user.password ) { //compare old password and user.password
            console.log('')
        }**/
        if (passwordField[1].value !== passwordField[2].value) { //compare new and confirm password
            console.log('new password and confirm password does not match');
        } else {
            editProfileSuccess[0].style.display = 'inline-block';
        }
        confirmPasswordPopup[0].style.display = 'none';
        
    });

    confirmPasswordButtonsCancel[0].addEventListener('click', function() {

        confirmPasswordPopup[0].style.display = 'none';
        clearValues(passwordField);
    });

    incompleteFieldOK[0].addEventListener('click', function() {
        incompleteFieldPopup[0].style.display = 'none';

    });

    noChangesOK[0].addEventListener('click', function() {
        noChangesPopup[0].style.display = 'none';
    })
    editProfileSuccessOK[0].addEventListener('click', function() {
        editProfileSuccess[0].style.display = 'none';
        clearValues(passwordField);
    } ); 

    function clearValues(elements) {
        for (i = 0;i<elements.length;i++) {
            elements[i].value = null;
        }
    }

    function checkPasswordFieldValue(elements) {
        if (passwordField[0].value.length != 0 | passwordField[1].value.length != 0 | passwordField[0].value.length != 0) {
            if (passwordField[0].value.length != 0 & passwordField[1].value.length != 0 & passwordField[0].value.length != 0) {
                confirmPasswordPopup[0].style.display = 'inline-block';
            } else {
                incompleteFieldPopup[0].style.display = 'inline-block';
            }
        } else {
            noChangesPopup[0].style.display = 'inline-block';
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
        checkPasswordFieldValue(passwordField);
        passwords[0].style.display = 'none'
        saveButton.style.display = 'none';
        cancelButton.style.display = 'none';
        editButton.style.display = 'inline-block';
        clearValues(passwordField);
    });

    cancelButton.addEventListener('click', function() {
        // Reset input fields to their original values
        profileInputs.forEach(input => {
            input.setAttribute('disabled', 'true');
        });
        passwords[0].style.display = 'none'
        saveButton.style.display = 'none';
        cancelButton.style.display = 'none';
        editButton.style.display = 'inline-block';
        clearValues(passwordField);
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

document.addEventListener('DOMContentLoaded', () => {
    const table = document.getElementById('service-table');
    const columnIdx = 0; // First column
  
    // Function to create the "Select All" checkbox in the header
    function createSelectAllCheckbox() {
      const checkboxHeader = document.createElement('input');
      checkboxHeader.type = "checkbox";
      checkboxHeader.id = `header-checkbox-${columnIdx}`;
  
      // Insert the checkbox into the header cell of the specified column
      const headerRow = table.querySelector('thead tr');
      const headerCell = document.createElement('th');
      headerCell.appendChild(checkboxHeader); // Add checkbox to the header cell
      headerRow.insertBefore(headerCell, headerRow.childNodes[columnIdx]); // Insert header cell into the header row
  
      // Handle header checkbox logic to select/deselect all checkboxes in the column
      checkboxHeader.addEventListener('change', () => {
        const checkboxes = table.querySelectorAll(`tbody tr td:nth-child(${columnIdx + 1}) input[type="checkbox"]`);
        checkboxes.forEach(cb => {
          cb.checked = checkboxHeader.checked;
        });
      });
    }
  
    // Event listener for "Drop Service" button
    document.getElementById('dropService').addEventListener('click', () => {
      // Toggle button text between "- Drop Service" and "Cancel"
      const button = document.getElementById('dropService');
      const confirmButton = document.getElementById('confirmDrop');
      if (button.innerText === "- Drop Service") {
        button.innerText = "Cancel";
        
        confirmButton.style.display = 'block';
        // Create the "Select All" checkbox in the header
        createSelectAllCheckbox();
  
        // Add checkboxes to each row in the specified column if they don't exist
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
          let checkboxCell = row.cells[columnIdx].querySelector('input[type="checkbox"]');
          if (!checkboxCell) {
            // Create a new checkbox element for each row
            checkboxCell = document.createElement('input');
            checkboxCell.type = "checkbox";
            checkboxCell.className = "service-checkbox"; // Add class for styling and identification
            row.cells[columnIdx].appendChild(checkboxCell); // Add checkbox to the cell
          }
        });
  
      } else {
        button.innerText = "- Drop Service";
        confirmButton.style.display = 'none';
  
        // Remove checkboxes from each row in the specified column
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
          const checkboxCell = row.cells[columnIdx].querySelector('input[type="checkbox"]');
          if (checkboxCell) {
            checkboxCell.remove(); // Remove row checkbox if it exists
          }
        });
  
        // Remove the "Select All" checkbox from the header
        const checkboxHeader = document.getElementById(`header-checkbox-${columnIdx}`);
        if (checkboxHeader) {
          checkboxHeader.parentElement.remove(); // Remove header checkbox cell
        }
      }
    });
  });

  function postCheckedCheckboxes(url, data) {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ unit: data })
    })
   .then(response => {
      if (!response.ok) {
        console.log("Error")
      }
      return response.json();
    })
   .then(responseData => {
      console.log('Post response:', responseData);
      // Redirect or update the UI as needed
      window.location.reload(); // Reload the page after deletion
    })
   .catch(error => {
      console.error('Post error:', error);
    });
  }
  
  document.getElementById('confirmDrop').addEventListener('click', () => {
    // Select all checkboxes that are checked
    const checkboxes = document.querySelectorAll('#service-table tbody input[type="checkbox"]:checked');
    const unit = Array.prototype.map.call(checkboxes, checkbox => checkbox.parentNode.parentNode.cells[0].id);
    
    postCheckedCheckboxes('/admin/drop-services', unit);
  });