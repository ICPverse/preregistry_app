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
    const publicKey = await window.ic.plug.requestConnect({
      whitelist,
    });
    console.log(publicKey);
  } catch (e) {
    console.log(e);
  }
}

export function get_principal() {
  const principalId = window.ic.plug.agent.getPrincipal();
  console.log(principalId);
}

export async function get_balance() {
  const result = await window.ic.plug.requestBalance();
  console.log(result);
}

export async function get_nft() {
  // ERC721 standard
  const actor = await window.ic.plug.createActor({
    canisterId: ghost_canister,
    interfaceFactory: factory,
  });

  const result = await actor.tokens_ext(window.ic.plug.accountId);
  if ("ok" in result) {
    console.log(result.ok[0][0]);
  }
}
