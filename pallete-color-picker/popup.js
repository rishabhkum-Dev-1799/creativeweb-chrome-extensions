const picker_btn = document.querySelector(".btn_pick-color");
const color_grid = document.querySelector(".selected-color-grid");
const color_value = document.querySelector(".selected-color-value");
const copy_btn = document.querySelector(".btn-copy");
const toastBox = document.querySelector("#toastBox");

let selectedColor = null;
const showToast = () => {
  toastBox.innerText = "Copied!!";
  toastBox.style.visibility = "visible";
  removeToast();
};

function removeToast() {
  setTimeout(() => {
    toastBox.innerText = "";
    toastBox.style.visibility = "hidden";
  }, 2000);
}

picker_btn.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const eyeDropper = new EyeDropper();
  const abortController = new AbortController();
  selectedColor = await eyeDropper
    .open({ signal: abortController.signal })
    .then((results) => results)
    .catch((error) => {
      return null;
    });
  if (selectedColor) {
    const color = selectedColor.sRGBHex;
    color_grid.style.backgroundColor = color;
    color_grid.style.border = "1px solid #FFF";
    color_value.innerText = color;
    copy_btn.style.visibility = "visible";
  }
});

copy_btn.addEventListener("click", async () => {
  try {
    if (selectedColor) {
      console.log("clicked");
      await navigator.clipboard
        .writeText(selectedColor.sRGBHex)
        .then(() => showToast());
    }
  } catch (error) {
    console.log(error.message);
  }
});
