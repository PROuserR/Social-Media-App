home_img = document.getElementById('home')
home.src = '/static/bootstrap-icons/house-fill.svg'

var user_id = document.getElementById('my_id').value

var my_container = document.getElementById('my_container')
like_flag = true
pop_over = true

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');

function news_feed(){
    my_container.innerHTML = ``
    fetch(`https://prouserr.pythonanywhere.com/api/news_feed/`).then((resp) => resp.json()).then(function(posts){
        
        posts.forEach(fill_posts)

        function fill_posts(post){
            fetch(`https://prouserr.pythonanywhere.com/api/get_profile/${post.owner}`).then((resp2) => resp2.json()).then(function(profile){
            now = new Date()
            py_date = new Date(post.date_added)
            delta = time_delta(now, py_date)

            if(typeof(post.likes.slice(-1)[0]) == 'undefined'){
                like_id = 1
            }
            else{
                like_id = post.likes.slice(-1)[0]
            }

            my_container.innerHTML += `
            <div class="social-feed-box">

            <div class="social-avatar d-flex align-items-center justify-content-between mb-3">
                <div>
                    <a href="https://prouserr.pythonanywhere.com/user_profile/${profile.id}" style="text-decoration: none;">
                    <img class="rounded-circle" width="30px" src="${profile.image}">
                    </a>

                    <a class="underline" href="https://prouserr.pythonanywhere.com/user_profile/${profile.id}">
                        ${profile.username}
                    </a>
                </div>


                <div class="d-inline-flex justify-content-end">
                    <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false"></button>
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        <li><a class="dropdown-item" href="https://prouserr.pythonanywhere.com/api/delete_post/${post.id}">Delete post</a></li>
                    </ul>
                </div>
            </div>
            <div class="social-body">
                <img src="${post.image}" width="500px" class="img-responsive">
                <br>
                <div class="btn-group">
                    <img src="/static/bootstrap-icons/suit-heart.svg" id="heart_${post.id}" width="25px" style="margin-right: 20px" onclick="add_like(${like_id}, ${post.id})">
                    <img src="/static/bootstrap-icons/chat-left-dots.svg" width="25px" data-bs-toggle="modal" data-bs-target="#exampleModal-${post.id}" onclick="get_comments(${post.id})">
                </div>
            </div>
            <div style="margin-left: 20px;">
                <div class="social-comment">
                <span id="likes_${post.id}">${post.likes.length}</span> likes
                <br>

                <a class="underline" href="https://prouserr.pythonanywhere.com/user_profile/${profile.id}" style="font-weight: bolder;">
                    ${profile.username}
                </a>
                        ${post.caption}
                    </div>
                    <small class="text-muted">${time_delta(now, py_date)}</small>
                    <div class="input-group flex-nowrap">
                      <input type="text" id="comment-input-${post.id}" class="form-control" placeholder="Add a comment.." aria-label="Username" aria-describedby="addon-wrapping">
                      <button type="button" class="btn btn-outline-primary" onclick="add_comment(${post.id})">Post</button>
                    </div>
                </div>
              <br>

        
            </div>

        </div>

        <div class="modal fade" id="exampleModal-${post.id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Comments</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" id="comments-${post.id}">
              ...
            </div>
          </div>
        </div>
      </div>
            `
        })
    }
    })
}


function add_comment(post_id){
    comment = document.getElementById(`comment-input-${post_id}`).value
    fetch(`https://prouserr.pythonanywhere.com/api/add_comment/${post_id}`, {
        method:'POST', 
        headers:{
            'Content-type':'application/json',
            'X-CSRFToken':csrftoken,
        },
        body:JSON.stringify({'content': comment, 'commenter': user_id})
    })
    document.getElementById(`comment-input-${post_id}`).value = ''
}



function add_like(like_id, post_id){
    heart = document.getElementById(`heart_${post_id}`)

    if(heart.src.includes('/static/bootstrap-icons/suit-heart.svg'))
        heart.src = '/static/bootstrap-icons/suit-heart-fill red.svg'
    else
        heart.src = '/static/bootstrap-icons/suit-heart.svg'


    if(like_flag){
        fetch(`https://prouserr.pythonanywhere.com/api/add_like/${post_id}`, {
            method:'POST', 
            headers:{
                'Content-type':'application/json',
                'X-CSRFToken':csrftoken,
            },
            body:JSON.stringify({'liker': user_id,})
        })
        likes = document.getElementById(`likes_${post_id}`)
        likes.innerText = parseInt(likes.innerText) + 1
    }
    else
    {   
        fetch(`https://prouserr.pythonanywhere.com/api/delete_like/${like_id}`, {
            method:'DELETE', 
            headers:{
                'Content-type':'application/json',
                'X-CSRFToken':csrftoken,
            },
        })
        likes = document.getElementById(`likes_${post_id}`)
        likes.innerText = parseInt(likes.innerText) - 1
    }

    like_flag = !like_flag
}


function get_comments(post_id){
    fetch(`https://prouserr.pythonanywhere.com/api/get_comments/${post_id}`).then((resp) => resp.json()).then(function(comments){
        comments.forEach(fill_comments)

        function fill_comments(comment){
            comments_body = document.getElementById(`comments-${post_id}`)
            comments_body.innerHTML = ``

            fetch(`https://prouserr.pythonanywhere.com/api/get_profile/${comment.commenter_id}`).then((resp) => resp.json()).then(function(user){
                    comments_body.innerHTML += `${user.username}: ${comment.content} <br>`
            })
                
        }            
    })
}

function time_delta(date1, date2){
    delta = (date1 - date2) / 1000
    ago = 'seconds ago'
    if(delta > 60){
      delta /= 60
      ago = 'minutes ago'
      if(delta > 60){
        delta /= 60
        ago = 'hours ago'
        if(delta > 24){
          delta /= 24
          ago = 'days ago'
        }
      }
    }
    return `${Math.floor(delta)} ${ago}`
}

news_feed()