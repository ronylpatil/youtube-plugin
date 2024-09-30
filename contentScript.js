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

  const countOfComments = document.querySelectorAll("ytd-comment-thread-renderer.style-scope.ytd-item-section-renderer").length;

  // Selector element
  const comments = document.querySelectorAll("ytd-comment-view-model");
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
  updateStats(totalLikes, totalReplies, countOfComments);
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
      background: #98ff00;
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
      text-align: left;
      bottom: 25px;
      right: 5px;
      background-color: black; /* darker background */
      border: 2px outset #98ff00; 
      padding: 12px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      font-family: consolas;
      font-size: 12px; /* increased font size */
      font-weight: 500; /* thicker font */
      color: #00ff41; /* purple font color */
      opacity: 0.8; /* 90% transparent overall */
      animation: movingBorder 2s infinite;
    }

    #comment-stats::before {
      content: "COMMENTS STATS";
      text-align: left;
      display: block;
      font-size: 16px;
      font-family: consolas;
      font-weight: 500;
      color: 	#ffe202; /* title color */
      margin-bottom: 3px;
    }

    @keyframes movingBorder {
      0% {
        border-color: #ff0000;
        box-shadow: 0 0 5px #ff0000;
      }
      20% {
        border-color: #0000ff;
        box-shadow: 0 0 5px #0000ff;
      }
      40% {
        border-color: #00ff00;
        box-shadow: 0 0 5px #00ff00;
      }
      60% {
        border-color: #ffff00;
        box-shadow: 0 0 5px #ffff00;
      }
      80% {
        border-color: #ff00f1;
        box-shadow: 0 0 5px #ff00f1;
      }
      100% {
        border-color: #8ddfff;
        box-shadow: 0 0 5px #8ddfff;
      }
    }
  `;
  document.head.appendChild(style);
}

function updateStats(totalLikes, totalReplies, countOfComments) {
  const statsElement = document.getElementById("comment-stats");
  if (!statsElement) {
    const element = document.createElement("div");
    element.id = "comment-stats";
    document.body.appendChild(element);
  }

  // Handle NaN values
  totalLikes = isNaN(totalLikes) ? 0 : totalLikes;
  totalReplies = isNaN(totalReplies) ? 0 : totalReplies;
  countOfComments = isNaN(countOfComments) ? 0 : countOfComments;
  
  totalComments = countOfComments + totalReplies
  avgLikes = totalLikes / countOfComments
  avgReplies = totalReplies / countOfComments

  document.getElementById("comment-stats").innerHTML = `
      TOTAL LIKES - ${totalLikes.toLocaleString()} <br>
      TOTAL REPLIES - ${totalReplies.toLocaleString()} <br>
      TOTAL COMMENTS - ${(totalComments).toLocaleString()} <br>
      AVG LIKES - ${(isNaN(avgLikes) ? 0 : avgLikes).toFixed(2).toLocaleString()} <br>
      AVG REPLIES - ${(isNaN(avgReplies) ? 0 : avgReplies).toFixed(2).toLocaleString()}
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
