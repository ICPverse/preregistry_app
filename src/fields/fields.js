import template from "./fields.html";

const field_buttons = document.createElement("div");
field_buttons.innerHTML = template;
document.body.appendChild(field_buttons);

export async function getValues() {
  return document.getElementById("uname").value;
}

const get_principal_button = document.getElementById("buttong");
get_principal_button.addEventListener("click", () => validateForm());

function validateForm() {
  let email = document.getElementById("email").value;
  let userName = document.getElementById("password").value;
  let fav = document.getElementById("nft").value;

  let url = "http://localhost:5000/api/setdetails";

  let walletID = localStorage.getItem("walletID");
  if (!walletID) {
    alert("WalletID is required");
    return;
  }

  try {
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(
      JSON.stringify({
        email: email,
        userName: userName,
        fav: fav,
        walletID: walletID,
      })
    );
    alert("request sent");
  } catch (err) {
    console.log("err", JSON.stringify(err));
  }
  console.log("req");
}
