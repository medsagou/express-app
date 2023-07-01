const cancel = document.querySelector(".cancel");

cancel.addEventListener("click", () => {
  history.back();
});

function goBack() {
  history.back();
}
