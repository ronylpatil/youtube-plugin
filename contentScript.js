let processing = false;

// Click on "read more" button and expand the long comments
function expandReadMoreComments() {
  const readMoreButtons = document.querySelectorAll("tp-yt-paper-button#more");
  readMoreButtons.forEach((button) => {
    button.click();
  });
}

// Highlight comments based on length of comments
function highlightComments() {
  if (processing) return;
  processing = true;

  // Selector element
  const comments = document.querySelectorAll("ytd-comment-view-model");
  //   const comments = document.querySelectorAll("style-scope.ytd-item-section-renderer");
  let totalLikes = 0;
  let totalReplies = 0;

  comments.forEach((comment) => {
    // Fetching content of comments
    const textElement = comment.querySelector("#content-text");
    const commentText = textElement.textContent;

    // Calculate word count
    const commentLength = commentText.trim().split(/\s+/).length;

    // calculate total likes
    const voteCountElement = comment.querySelector("#vote-count-middle");
    if (voteCountElement) {
      const voteCountText = voteCountElement.textContent;
      let voteCountNumber = 0;

      if (voteCountText.includes("K")) {
        voteCountNumber = parseFloat(voteCountText.replace("K", "")) * 1000;
      } else if (voteCountText.includes("M")) {
        voteCountNumber = parseFloat(voteCountText.replace("M", "")) * 1000000;
      } else {
        voteCountNumber = parseInt(voteCountText);
      }

      // Check for NaN
      if (!isNaN(voteCountNumber)) {
        totalLikes += voteCountNumber;
      }
    }

    // Add class for styling
    if (commentLength > 50) {
      textElement.classList.add("long-comment");
    } else {
      textElement.classList.add("short-comment");
    }
  });

  const comments1 = document.querySelectorAll("ytd-comment-replies-renderer");
  comments1.forEach((comment) => {
    // Fetching content of comments
    const replyButton = comment.querySelector("#more-replies");

    if (replyButton) {
      const replyCountElement = replyButton.querySelector(
        ".yt-spec-button-shape-next__button-text-content"
      );

      if (replyCountElement) {
        const replyCountText = replyCountElement.textContent
          .trim()
          .split(" ")
          .shift();

        let replyCountNumber = 0;

        if (replyCountText.includes("K")) {
          replyCountNumber = parseFloat(replyCountText.replace("K", "")) * 1000;
        } else if (replyCountText.includes("M")) {
          replyCountNumber =
            parseFloat(replyCountText.replace("M", "")) * 1000000;
        } else {
          replyCountNumber = parseInt(replyCountText);
        }

        // Check for NaN
        if (!isNaN(replyCountNumber)) {
          totalReplies += replyCountNumber;
        }
      }
    }
  });

  // Update total likes and replies
  updateStats(totalLikes, totalReplies);

  processing = false;
}

// Highlight the comments by red/green circle - CSS
function addStyles() {
  const style = document.createElement("style");
  style.innerHTML = `
    .long-comment::after {
      content: "";
      background: red;
      border-radius: 50%;
      width: 11px;
      height: 11px;
      display: inline-block;
      margin-left: 5px;
      float: right;
      position: relative;
      top: 3px;
    }
    .short-comment::after {
      content: "";
      background: green;
      border-radius: 50%;
      width: 11px;
      height: 11px;
      display: inline-block;
      margin-left: 5px;
      float: right;
      position: relative;
      top: 3px;
    }
    #comment-stats {
      position: fixed;
      bottom: 50px;
      right: 10px;
      background-color: #fff;
      border: 1px solid #ddd;
      padding: 10px;
      border-radius: 5px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      font-size: 14px;
    }
  `;
  document.head.appendChild(style);
}

function updateStats(totalLikes, totalReplies) {
  const statsElement = document.getElementById("comment-stats");
  if (!statsElement) {
    const element = document.createElement("div");
    element.id = "comment-stats";
    document.body.appendChild(element);
  }

  // Handle NaN values
  totalLikes = isNaN(totalLikes) ? 0 : totalLikes;
  totalReplies = isNaN(totalReplies) ? 0 : totalReplies;

  document.getElementById("comment-stats").innerHTML = `
      Total Likes: ${totalLikes.toLocaleString()} <br>
      Total Replies: ${totalReplies.toLocaleString()}
    `;
}

addStyles();
expandReadMoreComments();
highlightComments();
setInterval(() => {
  expandReadMoreComments();
  highlightComments();
}, 2500);

// Wait for an HTML element to exist in the document before executing a callback function.
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

waitForElement("ytd-comment-thread-renderer", (target) => {
  const observer = new MutationObserver(() => {
    expandReadMoreComments();
    highlightComments();
  });
  observer.observe(target, {
    childList: true,
    subtree: true,
  });
});
