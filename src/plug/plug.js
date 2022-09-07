import template from "./plug.html";
import factory from "../factories/ghost_canister_factory";

const plug_buttons = document.createElement("div");
plug_buttons.innerHTML = template;
document.body.appendChild(plug_buttons);

const ghost_canister = "xzcnc-myaaa-aaaak-abk7a-cai";

const whitelist = [ghost_canister];

const connect_button = document.getElementById("connect_button_plug");
connect_button.addEventListener("click", () => connect_plug());

const get_principal_button = document.getElementById(
  "get_principal_button_plug"
);
get_principal_button.addEventListener("click", () => get_principal());

const get_balance_button = document.getElementById("get_balance_button_plug");
get_balance_button.addEventListener("click", () => get_balance());

const get_nft_button = document.getElementById("get_nft_button_plug");
get_nft_button.addEventListener("click", () => get_nft());

export async function connect_plug() {
  try {
    await window.ic.plug.requestConnect({
      whitelist,
    });
    console.log("plug connected");
  } catch (e) {
    console.log(e);
  }
}

export async function get_principal() {
  const principal = await window.ic.plug.agent.getPrincipal();
  console.log(principal.toString());
  return principal.toString();
}

export async function get_balance() {
  const balance = await window.ic.plug.requestBalance();
  console.log(balance);
  return balance;
}

export async function get_nft() {
  // ERC721 standard
  const actor = await window.ic.plug.createActor({
    canisterId: ghost_canister,
    interfaceFactory: factory,
  });

  const result = await actor.tokens_ext(window.ic.plug.accountId);
  if ("ok" in result) {
    console.log(result.ok);
    return result.ok;
  }
  if ("err" in result) {
    console.log("Something went wrong");
  }
}
