const popup = document.getElementsByClassName('popup');
const submitInquiryButton = document.getElementsByClassName('submit-inquiry');
const jecati = document.getElementsByClassName('jecati')
const closeBtn = document.getElementById('closeBtn');
            const cancelBtntwo = document.getElementById('cancelBtn');

jecati[0].addEventListener("click", landingPageRedirect);

closeBtn.addEventListener('click', () => {
    popup.style.display = 'none';
});

cancelBtntwo.addEventListener('click', () => {
    popup.style.display = 'none';
});

function landingPageRedirect() {
  window.location.replace('/landing-page');
}
function contactUsRedirect() {
  window.location.replace('/contact-us');
}
function inquireNow(element) {
  element[0].style.display = 'block';
}
function submitInquiry(element) {
  element[0].style.display = 'none';
}

$(document).ready(function () {
  $(".checkbox-dropdown").click(function () {
      $(this).toggleClass("is-active");
  });

  $(".checkbox-dropdowntwo").click(function () {
    $(this).toggleClass("is-active");
});


  $(".checkbox-dropdown ul").click(function(e) {
      e.stopPropagation();
  });
});

