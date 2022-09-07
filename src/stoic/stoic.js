import template from "./stoic.html";
import ghost_factory from "../factories/ghost_canister_factory";
import { StoicIdentity } from "ic-stoic-identity";
import { Actor, HttpAgent } from "@dfinity/agent";
import { AccountIdentifier, LedgerCanister } from "@dfinity/nns";

const plug_buttons = document.createElement("div");
plug_buttons.innerHTML = template;
document.body.appendChild(plug_buttons);

const ghost_canister = "xzcnc-myaaa-aaaak-abk7a-cai";

const connect_button = document.getElementById("connect_button_stoic");
connect_button.addEventListener("click", () => connect_stoic());

const get_principal_button = document.getElementById(
  "get_principal_button_stoic"
);
get_principal_button.addEventListener("click", () => get_principal());

const get_balance_button = document.getElementById("get_balance_button_stoic");
get_balance_button.addEventListener("click", () => get_balance());

const get_nft_button = document.getElementById("get_nft_button_stoic");
get_nft_button.addEventListener("click", () => get_nft());

export async function connect_stoic() {
  try {
    // identity is set on the window object
    window.identity = await StoicIdentity.connect();
    console.log(window.identity);
  } catch (error) {
    console.log(error);
  }
}

export function get_principal() {
  console.log(window.identity.getPrincipal().toString());
}

export async function get_balance() {
  const ledger = LedgerCanister.create();
  const principal = window.identity.getPrincipal();
  const accountIdentifier = AccountIdentifier.fromPrincipal({ principal });
  const balance = await ledger.accountBalance({ accountIdentifier });
  console.log(balance);
}

export async function get_nft() {
  try {
    // ERC721 standard
    const actor = Actor.createActor(ghost_factory, {
      agent: new HttpAgent({
        host: "https://mainnet.ic0.app/",
        identity: window.identity,
      }),
      canisterId: ghost_canister,
    });

    const principal = window.identity.getPrincipal();
    const accountIdentifier = AccountIdentifier.fromPrincipal({ principal });
    const result = await actor.tokens_ext(accountIdentifier.toHex());
    console.log(result);
    // if ("ok" in result) {
    //   console.log(result.ok[0][0]);
    // }
  } catch (error) {
    console.log(error);
  }
}
