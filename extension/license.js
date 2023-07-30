window.onload = () => {

    let title = chrome.i18n.getMessage('icon');
    document.title = title;
    document.querySelector("h1").innerText = title;

    let description = chrome.i18n.getMessage('description');
    document.querySelector("#description").innerText = description;
}