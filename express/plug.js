async function connect_plug() {
  try {
    const publicKey = await window.ic.plug.requestConnect();
    console.log(publicKey);
  } catch (e) {
    console.log(e);
  }
}

async function get_plug_principal() {
  const principalId = await window.ic.plug.agent.getPrincipal();
  console.log(principalId);
}

async function get_balance() {
  const result = await window.ic.plug.requestBalance();
  console.log(result);
}
