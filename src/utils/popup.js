const popup = document.getElementById("popup");
const popUp = ({
  title,
  message,
  cancel,
  proceed,
  warning,
  destructive,
  success,
  open,
}) => {
  if (!open) return;
  popup.innerHTML = "";

  const parentDiv = document.createElement("div");
  parentDiv.className = `modal-overlay`;

  const card = document.createElement("div");
  card.className = `modal-card`;

  const titl = document.createElement("h3");
  titl.textContent = title;

  const para = document.createElement("p");
  para.textContent = message;

  const parentButton = document.createElement("div");
  parentButton.className = "modal-actions";

  const cancelButton = document.createElement("button");
  cancelButton.className = "btn-secondary";
  cancelButton.textContent = "Cancel"; // Fix 2: Add text
  cancelButton.onclick = () => {
    parentDiv.remove(); // Self-destruct on cancel
    if (cancel) cancel();
  };

  const prcessButton = document.createElement("button");
  prcessButton.className = destructive ? "btn-danger" : "btn-primary";
  prcessButton.textContent = destructive
    ? "Confirm"
    : success
      ? "Proceed"
      : "Ok"; // Fix 2
  prcessButton.onclick = () => {
    parentDiv.remove();
    if (proceed) proceed();
  };

  parentDiv.appendChild(card);
  card.appendChild(titl);
  card.appendChild(para);

  parentButton.appendChild(cancelButton);
  parentButton.appendChild(prcessButton);

  card.appendChild(parentButton);

  popup.appendChild(parentDiv);
};

export default popUp;
