import template from "./infinity.html";
import {getValues} from "../fields/fields";

const infinity_buttons = document.createElement("div");
infinity_buttons.innerHTML = template;
document.body.appendChild(infinity_buttons);


const connect_button = document.getElementById("connect_button_infinity");
connect_button.addEventListener("click", () => connect_infinity());


const get_principal_button = document.getElementById(
  "get_principal_button_infinity"
);
get_principal_button.addEventListener("click", () => get_principal());

async function connect_infinity() {
    try {
      const publicKey = await window.ic.infinityWallet.requestConnect();
      console.log(`The connected user's public key is:`, publicKey);
    } catch (e) {
      console.log(e);
    }
  }
  window.connect_infinity = connect_infinity;

async function get_principal(){
  const nnsCanisterId = 'qoctq-giaaa-aaaaa-aaaea-cai'

  // Whitelist
  const whitelist = [
    nnsCanisterId,
  ];
  await window.ic.infinityWallet.requestConnect({
    whitelist,
  });
  const principalId = await window.ic.infinityWallet.getPrincipal();

  console.log(`InfinityWallet's user principal Id is ${principalId}`);
  var x = await getValues();
  console.log(x);

}
window.get_principal = get_principal;