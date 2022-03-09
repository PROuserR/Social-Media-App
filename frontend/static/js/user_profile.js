profile_img = document.getElementById('profile')
profile.src = '/static/bootstrap-icons/person-fill.svg'

var my_container = document.getElementById('my_container')
var my_id = document.getElementById('my_id').value
var user_id = document.getElementById('user_id').value
console.log(my_id)

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


function display_profile(){
    fetch(`http://127.0.0.1:8000/api/get_profile/${user_id}`).then((resp) => resp.json()).then(function(profile){
        console.log(profile)
    if(profile.followers.includes(parseInt(my_id))){
        my_container.innerHTML = `
        <div class="bg-white">
        <header>
            <div class="container">
                <div class="profile">
                    <div class="profile-image">
                        <img src="${profile.image}" class="rounded-circle" style="width: 150px" alt="">
                    </div>
        
                    
                        <div class="d-flex profile-user-settings">
                            <h1>${profile.username}</h1>
    
                            <button class="btn profile-edit-btn" id="">
                                Message
                            </button>
    
                            <button class="btn profile-edit-btn" id="" onclick="unfollow_user(${user_id})">
                                <img src="/static/bootstrap-icons/person-check-fill.svg" alt="" id="notifications">
                            </button>
                                
                            <button class="btn profile-edit-btn" style="margin-right:20px" id="">
                                ...
                            </button>
    
                        </div>
    
    
                    <div class="profile-stats">
        
                        <ul>
                            <li><span class="profile-stat-count">${profile.posts.length}</span> posts</li>
                            <li><span class="profile-stat-count">${profile.followers.length}</span> followers</li>
                            <li><span class="profile-stat-count">${profile.following.length}</span> following</li>
                        </ul>
        
                    </div>
    
                    <div class="profile-bio">
                        
                     <p><span class="profile-real-name">${profile.first_name} ${profile.last_name}</span> ${profile.bio}</p>
    
                     </div>
        
        
                </div>
                <!-- End of profile section -->
            </div>
            <!-- End of container -->
            <hr>
        </header>
        
        <main>
    
            <div class="container">
        
                <div class="gallery" id="gallery">
        
                </div>
                <!-- End of gallery -->
        
        
            </div>
            <!-- End of container -->
        
        </main>
    
    </div>
        `
    }
    else{
        my_container.innerHTML = `
        <br>
        <div class="bg-white">
        <header>
            <div>
                <div class="profile">
                    <div class="profile-image">
                        <img src="${profile.image}" class="rounded-circle" style="width: 150px" alt="">
                    </div>
        
                    
                        <div class="d-flex profile-user-settings">
                            <h1>${profile.username}</h1>
    
                            <button class="btn profile-edit-btn" id="">
                                Message
                            </button>
    
                            <button class="btn btn-primary" style="margin-left: 20px" id="follow-btn" onclick="follow_user(${profile.id})">
                                Follow
                            </button>
                            
                            <button class="btn profile-edit-btn" style="margin-right:20px" id="">
                                ...
                            </button>
    
                        </div>
    
    
                    <div class="profile-stats">
        
                        <ul>
                            <li><span class="profile-stat-count">${profile.posts.length}</span> posts</li>
                            <li><span class="profile-stat-count">${profile.followers.length}</span> followers</li>
                            <li><span class="profile-stat-count">${profile.following.length}</span> following</li>
                        </ul>
        
                    </div>
    
                    <div class="profile-bio">
                        
                     <p><span class="profile-real-name">${profile.first_name} ${profile.last_name}</span> ${profile.bio}</p>
    
                     </div>
        
        
                </div>
                <!-- End of profile section -->
            </div>
            <!-- End of container -->
            <hr>
        </header>
        
        <main>
    
            <div class="container">
        
                <div class="gallery" id="gallery">
        
                </div>
                <!-- End of gallery -->
        
        
            </div>
            <!-- End of container -->
        
        </main>
    
    </div>
        `
    }


        fetch(`http://127.0.0.1:8000/api/list_user_posts/${profile.id}`).then((resp) => resp.json()).then(function(data){
            var gallery = document.getElementById('gallery')
            for(var i=0;i<data.length;i++){
                gallery.innerHTML += `
                <div class="gallery-item" tabindex="0">
                
                <img src="${data[i].image}" class="gallery-image" alt="">
            
                <div class="gallery-item-info">
            
                    <ul>
                        <li class="gallery-item-likes"><span class="visually-hidden">Likes:</span><i class="fas fa-heart" aria-hidden="true"></i>❤️ ${data[i].likes.length}</li>
                        <li class="gallery-item-comments"><span class="visually-hidden">Comments:</span><i class="fas fa-comment" aria-hidden="true"></i>💬 ${data[i].comments.length}</li>
                    </ul>
            
                </div>
            
            </div>
                `
            }
            
        
        })
})
}

function follow_user(user_id){
    fetch(`http://127.0.0.1:8000/api/follow_user/${user_id}`, {
        method:'POST', 
        headers:{
            'Content-type':'application/json',
            'X-CSRFToken':csrftoken,
        }
    })
    console.log('follow')
}

function unfollow_user(user_id){
    fetch(`http://127.0.0.1:8000/api/unfollow_user/${user_id}`, {
        method:'POST', 
        headers:{
            'Content-type':'application/json',
            'X-CSRFToken':csrftoken,
        }
    })
    console.log('unfollow')
}

if(user_id != my_id){
    display_profile()
}
else{
    window.location.href = 'http://127.0.0.1:8000/my_profile/'
}
