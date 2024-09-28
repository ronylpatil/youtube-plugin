// function highlightComments() {
//   const comments = document.querySelectorAll("ytd-comment-view-model");

//   comments.forEach((comment) => {
//     const textElement = comment.querySelector("#content-text");
//     const commentText = textElement.textContent;
//     const commentLength = commentText.length;

//     if (commentLength > 200) {
//       const redCircle = document.createElement("span");
//       redCircle.classList.add("red-circle");
//       redCircle.style.background = "red";
//       redCircle.style.borderRadius = "50%";
//       redCircle.style.width = "8px";
//       redCircle.style.height = "8px";
//       redCircle.style.display = "inline-block";
//       redCircle.style.marginLeft = "5px";
//       redCircle.style.float = "right";
//       textElement.appendChild(redCircle);
//     } else {
//       const greenCircle = document.createElement("span");
//       greenCircle.classList.add("green-circle");
//       greenCircle.style.background = "green";
//       greenCircle.style.borderRadius = "50%";
//       greenCircle.style.width = "8px";
//       greenCircle.style.height = "8px";
//       greenCircle.style.display = "inline-block";
//       greenCircle.style.marginLeft = "5px";
//       greenCircle.style.float = "right";
//       textElement.appendChild(greenCircle);
//     }
//   });
// }

// highlightComments();
// setInterval(highlightComments, 2000);

// const observer = new MutationObserver(() => {
//   highlightComments();
// });
// observer.observe(document.body, { childList: true, subtree: true });

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
    const commentLength = commentText.length;

    if (commentLength > 200) {
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
      background: red;
      border-radius: 50%;
      width: 8px;
      height: 8px;
      display: inline-block;
      margin-left: 5px;
      float: right;
    }

    .short-comment::after {
      content: "";
      background: green;
      border-radius: 50%;
      width: 8px;
      height: 8px;
      display: inline-block;
      margin-left: 5px;
      float: right;
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
}, 5000);

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
