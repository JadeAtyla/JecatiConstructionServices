const popup = document.getElementsByClassName('popup');
const submitInquiryButton = document.getElementsByClassName('submit-inquiry');
function contactUsRedirect() {
  window.location.replace('/contact-us');
}
function inquireNow(element) {
  element[0].style.visibility = 'visible';
}
function submitInquiry(element) {
  element[0].style.visibility = 'hidden';
}