const path_page = location.pathname;
const link_active = document.querySelector(".nav-link[href='"+path_page+"']");
if(path_page) {
link_active?.classList.add("active");
} else {
document.querySelector(".nav-link[href='/']")?.classList.add("active");
}