const userId = sessionStorage.getItem("id");
const userPageNumber = sessionStorage.getItem("pageNumber");
console.log(userPageNumber);

// function for request to User api
async function fetchUser(page = 1) {
  try {
    const response = await fetch(`http://nadir.somee.com/api/users/GetUserProfile/${userId}/${userPageNumber}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user profile: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }
}

// function for request to Comments api
async function fetchUserComments(postId) {
  console.log(`Fetching comments for post ID: ${postId}`);
  try {
    const response = await fetch(`http://nadir.somee.com/api/comments/GetPostComments/${postId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch comments: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(`Comments fetched for post ID: ${postId}`, data.comments);
    return Array.isArray(data.comments) ? data.comments : [];
  } catch (error) {
    console.error("Error fetching comments:", error);
  }
}

// function for html code of posts 
async function createPost(post) {
  try {
    const comments = await fetchUserComments(post.postId);
    const postDiv = document.createElement("div");
    postDiv.classList.add("user-profile__post", "mb-4");

    postDiv.innerHTML = `
      <span data-postid="${post.postId}" class="d-none postId"></span>
      ${post.imageUrl ? `<img src="${post.imageUrl}" height="200" width="200" alt="" class="user-profile__post-img" />` : ''}
      <strong class="user-profile__post-content d-block mb-4">${post.content}</strong>
      <div class="user-profile__post-comments">
        <strong class="d-block mb-3"><i class="fa-solid fa-comments"></i> Rəylər</strong>
        <hr />
        ${comments.length > 0 ? comments.map(comment => createComment(comment)).join("") : '<p>Rəy yoxdur</p>'}
      </div>
      <nav class="d-flex justify-content-center mb-4">
        <div class="pagination pages">
          <button class="page-item btn btn-primary p-2 mx-1">1</button>
        </div>
      </nav>
      <div class="delete text-end">
        <button class="btn btn-danger px-3 py-2 delete-post">Postu Sil</button>
      </div>
    `;

    return postDiv;
  } catch (error) {
    console.error("Error creating post:", error);
  }
}


// function for html code of comments area 
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
      <p class="mb-2 commentId" data-commentId="${comment.commentId}">${comment.commentContent}</p>
      <button class="btn delete-comment btn-danger px-2 py-1">Rəyi Sil</button>
    </div>
  `;
}

// function for html code of user 
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

// function for append profile to div
function populateUserProfile(user) {
  const userProfileBodyTop = document.querySelector(".user-profile__body-top");
  userProfileBodyTop.appendChild(createUserProfile(user));
}

// function for append posts to div
// in here i call this functions because i only can get results of btns when appended all posts
async function populateUserPosts(posts = []) {
  const userProfilePosts = document.querySelector(".user-profile__posts");
  for (const post of posts) {
    const postElement = await createPost(post);
    userProfilePosts.appendChild(postElement);
  }
  getDeletePostBtn();
  getDeleteCommentBtn();
}

// function for get results of api and 
//populateUserProfile,populateUserPosts
async function init() {
  try {
    const userData = await fetchUser();
    if (userData) {
      populateUserProfile(userData);
      await populateUserPosts(userData.posts);
    }
  } catch (error) {
    console.error("Error initializing user profile:", error);
  }
}

// function for change data format to day.month.year / hour:minute:second
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

// function for get related delete comment btn
// in here I pass commentId to deleteComment(commentId) for delete related comment
function getDeleteCommentBtn(){
  const deleteCommentBtns = document.querySelectorAll(".delete-comment");
  deleteCommentBtns.forEach(btn => {
    btn.addEventListener("click", function () {
      const relatedBtn = this.closest(".user-profile__post-comment").querySelector(".commentId");
      const commentId = relatedBtn.getAttribute("data-commentId");
      deleteComment(commentId);
    });
  });
}

// function for request api for deleteComment 
// commentId comes from getDeleteCommentBtn() function
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

// function for get related delete post btn
// in here I pass postId to deletePost(postId) for delete related post
function getDeletePostBtn() {
  const deletePostBtns = document.querySelectorAll(".delete-post");
  deletePostBtns.forEach(btn => {
    btn.addEventListener("click", function () {
      const relatedBtn = this.closest(".user-profile__post").querySelector(".postId");
      const postId = relatedBtn.getAttribute("data-postid");
      deletePost(postId);
    });
  });
}

// function for request api for deletePost 
// postId comes from getDeletePostBtn() function
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
      document.querySelector(`.user-profile__post[data-postid="${postId}"]`).remove();
    })
    .catch(error => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

init();
