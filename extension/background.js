chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "openInNewTab") {
        chrome.tabs.create(
            {
                url: message.targeturl,
                active: false
            }
        );
    }
});

chrome.runtime.onInstalled.addListener(() => {
    /*
    chrome.tabs.create(
        {
            url: "license.html",
            active: true
        }
    );
    */
});

chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.create(
        {
            url: "license.html",
            active: true
        }
    );
});