chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "commentHighlighted") {
    console.log("Comment highlighted:", request.data);
    // Handle highlighted comment data
  }
});
