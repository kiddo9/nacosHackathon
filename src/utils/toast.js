const toast = document.getElementById("toast");
const toastMessage = (message, type) => {
  const toastDiv = document.createElement("div");
  toastDiv.className = `toastMessage ${type}`;

  const p = document.createElement("p");
  p.textContent = message;

  toastDiv.appendChild(p);
  toast.appendChild(toastDiv);

  setTimeout(() => {
    toastDiv.remove();
  }, 5000);
};

export default toastMessage;
