// function openTab(evt, tabName) {
//   // Hide all tab content
//   var tabContent = document.getElementsByClassName("tab");
//   for (var i = 0; i < tabContent.length; i++) {
//     if (tabContent[i].style.display === "block") {
//       tabContent[i].classList.add("slide-right");
//       setTimeout(function() {
//         tabContent[i].style.display = "none";
//         tabContent[i].classList.remove("slide-right");
//       }, 300);
//     }
//   }

//   // Deactivate all tab buttons
//   var tabButtons = document.getElementsByClassName("tab-button");
//   for (var i = 0; i < tabButtons.length; i++) {
//     tabButtons[i].className = tabButtons[i].className.replace(" active", "");
//   }

//   // Show the selected tab content and activate the button
//   var selectedTab = document.getElementById(tabName);
//   selectedTab.style.display = "block";
//   selectedTab.classList.add("slide-left");
//   evt.currentTarget.className += " active";
//   setTimeout(function() {
//     selectedTab.classList.remove("slide-left");
//   }, 300);
// }

// // Open the first tab by default
// document.getElementById("tab1").style.display = "block";
// document.getElementsByClassName("tab-button")[0].className += " active";

class Tabs {
  constructor (elementSelector) {

    this.element = document.querySelector(elementSelector);
    this.tabsTogglers = this.element.querySelectorAll('.tab__toggler');
    this.tabsContent = this.element.querySelectorAll('.tab__content');
    this.listTabs = this.element.querySelector('.tabs__content-list');
    console.log(this.listTabs)
    this.index = 0;

    this.initEvent();
  }

  slideTo(index) {
    const width = this.listTabs.getBoundingClientRect().width;
    console.log(width)
    this.addClassToElement(this.tabsTogglers[index], 'is-active');
    this.addClassToElement(this.tabsContent[index], 'is-active');
    this.listTabs.style.transform = `translateX(-${width * index}px)`;
    // this.listTabs.style.transform = `translateX(50px)`;
  }

  removeActive(listElements, nameClass) {
    listElements.forEach(element => {
      element.classList.remove(nameClass);
    });
  }

  addClassToElement(element, nameClass) {
    element.classList.add(nameClass)
  }


  initEvent() {
    this.tabsTogglers.forEach((tab, index) => {
      tab.addEventListener('click', (e) => {
        this.removeActive(this.tabsTogglers, "is-active");
        this.removeActive(this.tabsContent, "is-active");
        this.slideTo(index);
      })
    })
  }
}

new Tabs(".tabs-widget");