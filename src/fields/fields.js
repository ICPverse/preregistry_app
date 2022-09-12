import template from "./fields.html";

const field_buttons = document.createElement("div");
field_buttons.innerHTML = template;
document.body.appendChild(field_buttons);

export async function getValues(){
    return document.getElementById("uname").value;
}
