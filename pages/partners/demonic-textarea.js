const textarea = document.querySelector("textarea.demonic-textarea");
textarea.setAttribute("style", "height:" + (textarea.scrollHeight) + "px;overflow-y:auto;");
textarea.addEventListener("input", OnInput, false);

function OnInput() {
    console.log(textarea);
    textarea.style.height = "auto";
    textarea.style.height = (textarea.scrollHeight) + "px";
}