/**
 * Menu Dialog
 */

 function closeMenuDialog(element, toggle) {
  element.setAttribute("data-dialog", "closed");
  toggle.setAttribute("aria-expanded", false);
}

function openMenuDialog(element, toggle) {
  element.setAttribute("data-dialog", "open");
  toggle.setAttribute("aria-expanded", true);
}

function closeWithEscapeKey(element, toggle) {
  window.addEventListener('keydown', (event) => {
    if (event.code === 'Escape') {
      closeMenuDialog(element, toggle)
    }
  });   
}


/**
 * Hamburguer Menu
 */

function initMenu() {
  const menu = document.querySelector(".menu"),
    menuToggle = document.querySelector(".menu-toggle");

  function toggleMenu() {
    const isActive = menu.getAttribute("data-dialog") === "open";
    isActive ? closeMenuDialog(menu, menuToggle) : openMenuDialog(menu, menuToggle);
  }
  
  menuToggle.addEventListener("click", toggleMenu);
  closeWithEscapeKey(menu, menuToggle);
}

initMenu()


/**
 * Submenu
 */

function initSubmenu() {
  const submenu = document.querySelectorAll('[data-dialog].menu-nav__item');

  function toggleSubmenu() {
    const isActive = this.parentNode.getAttribute("data-dialog") === "open";
    isActive ? closeMenuDialog(this.parentNode, this) : openMenuDialog(this.parentNode, this);
  }

  submenu.forEach(item => {
    item.firstElementChild.addEventListener('click', toggleSubmenu);

    document.addEventListener('click', function(event) {
      const isClickInsideElement = item.contains(event.target);
      if (!isClickInsideElement) closeMenuDialog(item, item.firstElementChild)
    });

    closeWithEscapeKey(item, item.firstElementChild);
  });
}

initSubmenu()