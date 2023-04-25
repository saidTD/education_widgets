// add background to nav when scrolling to the bottom
const nav = document.querySelector(".navigation");
const navbarWrapper = document.querySelector(".navbar-wrapper");
const toggler = document.querySelector(".navbar-toggler");
const icon = document.querySelector(".humburger");

// set active item
const path_page = location.pathname;
const link_active = document.querySelector(".nav-link[href='"+path_page+"']");
if(path_page) {
  link_active?.classList.add("active");
} else {
  document.querySelector(".nav-link[href='/']")?.classList.add("active");
}

// nav toggler
toggler?.addEventListener('click', () => {
  if(toggler.getAttribute('aria-expanded') === 'false') {
    toggler.setAttribute('aria-expanded', 'true');
    navbarWrapper.classList.add('show');
    icon.classList.add("open");
  } else {
    toggler.setAttribute('aria-expanded', 'false');
    navbarWrapper.classList.remove('show');
    icon.classList.remove("open");
  }
});

// set background on scroll and on load
 
function setBg() {
  const scrollHeight = window.pageYOffset;
  if (scrollHeight > 0) {
    nav.classList.add('shadow', 'border-bottom', 'bg-white');
  } else {
    nav.classList.remove('shadow', 'border-bottom', 'bg-white');
  }
}  

window.addEventListener("scroll", setBg);
window.addEventListener("load", setBg);