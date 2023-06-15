(() => {
  // set active navbar item
  const path_page = location.pathname;
  const link_active = document.querySelector(
    ".nav-link[href='" + path_page + "']"
  );
  if (path_page) {
    link_active?.classList.add("active");
  } else {
    document.querySelector(".nav-link[href='/']")?.classList.add("active");
  }

  // toggle navigation
  const toggler = document.querySelector(".navbar-toggler");
  const navigation = document.querySelector(".navbar-wrapper");

  toggler.addEventListener("click", () => {
    navigation.classList.toggle("show");
  });
})();
