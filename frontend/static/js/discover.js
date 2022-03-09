compass_img = document.getElementById('discover')
compass_img.src = '/static/bootstrap-icons/compass-fill.svg'

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

fetch(`https://prouserr.pythonanywhere.com/api/discover_posts/`).then((resp) => resp.json()).then(function(posts){
    for(i in posts){
            gallery = document.getElementById('gallery')
            gallery.innerHTML += `
            <div class="gallery-item" tabindex="0" data-bs-toggle="modal" data-bs-target="#postModal-${posts[i].id}">
            
            <img src="${posts[i].image}" class="gallery-image" alt="">
        
            <div class="gallery-item-info" >
        
                <ul>
                    <li class="gallery-item-likes"><span class="visually-hidden">Likes:</span><i class="fas fa-heart" aria-hidden="true"></i>❤️ ${posts[i].likes.length}</li>
                    <li class="gallery-item-comments"><span class="visually-hidden">Comments:</span><i class="fas fa-comment" aria-hidden="true"></i>💬 ${posts[i].comments.length}</li>
                </ul>
        
            </div>
            
            </div>
                `
            fill_posts(posts[i])
    }
})

function fill_posts(post){
    fetch(`https://prouserr.pythonanywhere.com/api/get_profile/${post.owner}`).then((resp2) => resp2.json()).then(function(profile){
    now = new Date()
    py_date = new Date(post.date_added)
    delta = time_delta(now, py_date)
    my_container.innerHTML += `

    <div class="modal fade" id="postModal-${post.id}" tabindex="-1" aria-labelledby="postModalLabel" aria-hidden="true">
    <div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-header">
        <h5 class="modal-title" id="postModalLabel">Post</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" id="post-${post.id}">

        <div class="social-avatar d-flex align-items-center justify-content-between mb-3">
            <div class="d-flex">
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
        </div>
        <div class="social-body">
            <img src="${post.image}" width="100%" class="img-responsive">
        </div>
        <div style="margin-left: 20px;">
            <div class="social-comment">
            <a class="underline" href="https://prouserr.pythonanywhere.com/user_profile/${profile.id}" style="font-weight: bolder;">
                ${profile.username}
            </a>
                    ${post.caption}
                </div>
                <small class="text-muted">${time_delta(now, py_date)}</small>
            </div>
        </div> 
    </div>

        </div>
    </div>
    </div>
    `
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