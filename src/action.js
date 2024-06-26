document.getElementById('openWindowBtn').addEventListener('click', function() {
    document.getElementById('window').style.display = 'block';
});

document.getElementById('closeBtn').addEventListener('click', function() {
    document.getElementById('window').style.display = 'none';
});

function toggleDropdown() {
    var dropdownOptions = document.getElementById("dropdownOptions");
    dropdownOptions.style.display = dropdownOptions.style.display === "block" ? "none" : "block";
}
