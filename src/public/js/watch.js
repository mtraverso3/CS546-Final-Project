/*
<form id="like-form" method="POST" action="/watch/like/{{video._id}}">
                                <button type="submit" class="action-btn">
                                    <span class="likes-count">{{video.like_count}}</span>
                                    Like
                                </button>
                            </form>
                            <form id="dislike-form" method="POST" action="/watch/dislike/{{video._id}}">
                                <button type="submit" class="action-btn">
                                    <span class="dislikes-count">{{video.dislike_count}}</span>
                                    Dislike
                                </button>
                            </form>

 */

// we are not going to use the like and dislike buttons, we need to prevent these from reloading the page and to make the color of the like and dislike buttons change when clicked
// we need to add an event listener to the like and dislike buttons

console.log("Hello from watch.js");

const likeForm = document.getElementById("like-form");
const dislikeForm = document.getElementById("dislike-form");

const likeButton = likeForm.querySelector("button");
const dislikeButton = dislikeForm.querySelector("button");

const likeCount = likeButton.querySelector(".likes-count");
const dislikeCount = dislikeButton.querySelector(".dislikes-count");

const likeAction = async (event) => {
  event.preventDefault();
  const response = await fetch(likeForm.action, {
    method: likeForm.method,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status === 200) {
    const data = await response.json();
    likeCount.innerHTML = data.like_count;
    const isLiked = data.is_liked;

    if (isLiked) {
      likeButton.classList.add("liked");
    } else {
      likeButton.classList.remove("liked");
    }
  }
};

const dislikeAction = async (event) => {
  event.preventDefault();
  const response = await fetch(dislikeForm.action, {
    method: dislikeForm.method,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status === 200) {
    const data = await response.json();
    dislikeCount.innerHTML = data.dislike_count;
    const isDisliked = data.is_disliked;

    if (isDisliked) {
      dislikeButton.classList.add("disliked");
    } else {
      dislikeButton.classList.remove("disliked");
    }
  }
};


likeForm.addEventListener("submit", likeAction);
dislikeForm.addEventListener("submit", dislikeAction);
