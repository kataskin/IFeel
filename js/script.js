var iconNav = document.querySelector(".page-header__icon-nav");

iconNav.addEventListener("click", function(event) {
  event.preventDefault();
  iconNav.classList.toggle("page-header__icon-nav--close");
});
