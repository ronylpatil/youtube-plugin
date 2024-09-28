let processing = false;

function expandReadMoreComments() {
  const readMoreButtons = document.querySelectorAll("tp-yt-paper-button#more");

  readMoreButtons.forEach((button) => {
    button.click();
  });
}

function highlightComments() {
  if (processing) return;
  processing = true;

  const comments = document.querySelectorAll("ytd-comment-view-model");

  comments.forEach((comment) => {
    const textElement = comment.querySelector("#content-text");
    const commentText = textElement.textContent;
    // const commentLength = commentText.length;
    const commentLength = commentText.trim().split(/\s+/).length;

    if (commentLength > 50) {
      textElement.classList.add("long-comment");
    } else {
      textElement.classList.add("short-comment");
    }
  });

  processing = false;
}

function addStyles() {
  const style = document.createElement("style");

  style.innerHTML = `
          .long-comment::after {
              content: "";
              background: red; /* Changed to bright red */
              border-radius: 50%;
              width: 11px; /* Increased size */
              height: 11px; /* Increased size */
              display: inline-block;
              margin-left: 5px; /* Adjusted position */
              float: right;
              position: relative; /* Added for positioning */
              top: 3px; /* Adjusted vertical position */
          }

          .short-comment::after {
              content: "";
              background: green;
              border-radius: 50%;
              width: 11px; /* Increased size */
              height: 11px; /* Increased size */
              display: inline-block;
              margin-left: 5px; /* Adjusted position */
              float: right;
              position: relative; /* Added for positioning */
              top: 3px; /* Adjusted vertical position */
          }
      `;

  document.head.appendChild(style);
}

addStyles();

expandReadMoreComments();
highlightComments();

setInterval(() => {
  expandReadMoreComments();
  highlightComments();
}, 4000);

function waitForElement(selector, callback) {
  const interval = setInterval(() => {
    const target = document.querySelector(selector);
    if (target && target instanceof Node) {
      clearInterval(interval);
      callback(target);
    }
  }, 100);
}

waitForElement("ytd-comment-thread-renderer", (target) => {
  const observer = new MutationObserver(() => {
    expandReadMoreComments();
    highlightComments();
  });
  observer.observe(target, { childList: true, subtree: true });
});
