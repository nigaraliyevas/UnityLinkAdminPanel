const userId = sessionStorage.getItem("id");
const userPageNumber = sessionStorage.getItem("pageNumber");
console.log(userPageNumber);

async function fetchUser(page = 1) {
  const response = await fetch(`http://nadir.somee.com/api/users/GetUserProfile/${userId}/${userPageNumber}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch user profile: ${response.statusText}`);
  }
  return response.json();
}

async function fetchUserComments(postId) {
  console.log(`Fetching comments for post ID: ${postId}`);
  const response = await fetch(`http://nadir.somee.com/api/comments/GetPostComments/${postId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch comments: ${response.statusText}`);
  }
  const data = await response.json();
  console.log(`Comments fetched for post ID: ${postId}`, data.comments);
  return Array.isArray(data.comments) ? data.comments : [];
}

async function createPost(post) {
  const comments = await fetchUserComments(post.postId);
  const postDiv = document.createElement("div");
  postDiv.classList.add("user-profile__post", "mb-4");

  postDiv.innerHTML = `
    <span data-postid="${post.postId}" class="d-none"></span>
    <img src="${post.imageUrl}" height="200" width="200" alt="" class="user-profile__post-img" />
    <strong class="user-profile__post-content d-block mb-4">${post.content}</strong>
    <div class="user-profile__post-comments">
      <strong class="d-block mb-3"><i class="fa-solid fa-comments"></i> Rəylər</strong>
      <hr />
      ${comments.map(comment => createComment(comment)).join("")}
    </div>
    <nav class="d-flex justify-content-center mb-4">
      <div class="pagination pages">
        <button>1</button>
      </div>
    </nav>
    <div class="delete text-end">
      <button onclick="deletePost(${post.postId})" class="btn btn-danger px-3 py-2">Postu Sil</button>
    </div>
  `;

  return postDiv;
}

function createComment(comment) {
  return `
    <div class="user-profile__post-comment mb-3">
      <div class="user-profile__post-comment__user">
        <div class="d-flex gap-3">
          <img src="${comment.userProfileImageUrl}" width="50" height="50" alt="" class="img-round" />
          <div>
            <span data-userId="${comment.userId}">${comment.userFullName}</span>
            <span>${changeDateFormat(comment.dateTime)}</span>
          </div>
        </div>
      </div>
      <p class="mb-2" data-commentId="${comment.commentId}">${comment.commentContent}</p>
      <button onclick="deleteComment(${comment.commentId})" class="btn delete-comment btn-danger px-2 py-1">Rəyi Sil</button>
    </div>
  `;
}

function createUserProfile(user) {
  const userDiv = document.createElement("div");
  userDiv.innerHTML = `
    <img src="${user.imageUrl}" alt="" class="" />
    <div>
      <p class="d-none" data-id="${user.userId}"></p>
      <h3 class="mb-3">${user.fullName}</h3>
      <span class="user-info"><i class="fa-solid fa-user"></i> İstifadəçi adı</span>
      <p>${user.userName}</p>
      <span class="user-info"><i class="fa-solid fa-briefcase"></i> Vəzifə</span>
      <p>${user.position}</p>
      <span class="user-info"><i class="fa-solid fa-building"></i> Şirkət</span>
      <p>${user.company}</p>
    </div>
  `;
  return userDiv;
}

function populateUserProfile(user) {
  const userProfileBodyTop = document.querySelector(".user-profile__body-top");
  userProfileBodyTop.appendChild(createUserProfile(user));
}

async function populateUserPostsAndComments(posts = []) {
  const userProfilePosts = document.querySelector(".user-profile__posts");
  userProfilePosts.innerHTML = '';

  for (const post of posts) {
    const postElement = await createPost(post);
    userProfilePosts.appendChild(postElement);
  }
}

async function init() {
  try {
    const userData = await fetchUser();
    if (userData) {
      populateUserProfile(userData);
      await populateUserPostsAndComments(userData.posts);
    }
  } catch (error) {
    console.error("Error initializing user profile:", error);
  }
}

function changeDateFormat(dateTime) {
  const date = new Date(dateTime);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");
  return `${day}.${month}.${year} / ${hours}:${minutes}:${seconds}`;
}

function deleteComment(commentId) {
  fetch(`http://nadir.somee.com/api/UsersManagment/DeleteUserComment/${commentId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      console.log("Comment deleted successfully:", data);
      document.querySelector(`.user-profile__post-comment[data-commentId="${commentId}"]`).remove();
    })
    .catch(error => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

function deletePost(postId) {
  fetch(`http://nadir.somee.com/api/UsersManagment/DeleteUserPost/${postId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      console.log("Post deleted successfully:", data);
      // Optionally, refresh posts
      document.querySelector(`.user-profile__post[data-postid="${postId}"]`).remove();
    })
    .catch(error => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

init();
