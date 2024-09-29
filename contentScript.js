let processing = false;

// click on "read more" button and expand the long comments
function expandReadMoreComments() {
  const readMoreButtons = document.querySelectorAll("tp-yt-paper-button#more");

  readMoreButtons.forEach((button) => {
    button.click();
  });
}

// highlight comments based on length of comments
function highlightComments() {
  if (processing) return;
  processing = true;

  // selector element
  const comments = document.querySelectorAll("ytd-comment-view-model");

  comments.forEach((comment) => {
    // fetching content of comments
    const textElement = comment.querySelector("#content-text");
    const commentText = textElement.textContent;
    // const commentLength = commentText.length;      // character count
    const commentLength = commentText.trim().split(/\s+/).length;     // word count

    if (commentLength > 50) {                       // if comment length > 50
      textElement.classList.add("long-comment");    // adds the CSS class "long-comment" to the HTML element textElement, which is the comment text container
    } else {
      textElement.classList.add("short-comment");  // adds the CSS class "short-comment" to the HTML element textElement, which is the comment text container
    }
  });

  processing = false;
}

// highlight the comments by red/green circle - CSS
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
}, 2500);

// Waits for an HTML element to exist in the document before executing a callback function.
// @param {string} selector - A CSS selector to target.
// @param {function} callback - Function to execute once the element is found.
function waitForElement(selector, callback) {
  const interval = setInterval(() => {
    const target = document.querySelector(selector);
    if (target && target instanceof Node) {
      clearInterval(interval);
      callback(target);
    }
  }, 100);
}

// Comments are expanded and highlighted initially.
// When new comments are loaded (e.g., infinite scrolling), the observer detects changes and re-executes comment expansion and highlighting.
waitForElement("ytd-comment-thread-renderer", (target) => {
  const observer = new MutationObserver(() => {
    expandReadMoreComments();
    highlightComments();
  });
  observer.observe(target, { childList: true, subtree: true });
});
