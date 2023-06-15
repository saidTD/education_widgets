(function openInputFile() {
  const toggler = document.querySelector(".file-view");
  const inputFile = document.getElementById("cv-file");
  if (!toggler || !inputFile) {
    return;
  }

  toggler.addEventListener("click", () => {
    inputFile.click();
  });
})();

new Form({ elementSelctor: ".hiring form", hasFile: true });
