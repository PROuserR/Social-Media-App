profile_img = document.getElementById('profile')
profile.src = '/static/bootstrap-icons/person-fill.svg'

var user_id = document.getElementById('my_id').value

var my_container = document.getElementById('my_container')
var show_login_activity_flag = true

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
    fetch(`http://https://prouserr.pythonanywhere.com//api/get_profile/${user_id}`).then((resp) => resp.json()).then(function(data){
    my_container.innerHTML = `
    <div class="bg-white">
    <header>
        <div class="container">
            <div class="profile">
                <div class="profile-image">
                    <img src="${data.image}" class="rounded-circle" style="width: 150px" alt="">
    
                </div>
    
                <div class="w-100 justify-content-between">
    
                    <h2 class="profile-user-name">${data.username}</h2>
    
                    <button class="btn profile-edit-btn" id="edit_profile_btn" onclick="display_edit_profile()">Edit Profile</button>
    
                    <svg data-bs-toggle="modal" data-bs-target="#SettingsModal" aria-label="Options" class="_8-yf5 " color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 48 48" width="24"><path clip-rule="evenodd" d="M46.7 20.6l-2.1-1.1c-.4-.2-.7-.5-.8-1-.5-1.6-1.1-3.2-1.9-4.7-.2-.4-.3-.8-.1-1.2l.8-2.3c.2-.5 0-1.1-.4-1.5l-2.9-2.9c-.4-.4-1-.5-1.5-.4l-2.3.8c-.4.1-.8.1-1.2-.1-1.4-.8-3-1.5-4.6-1.9-.4-.1-.8-.4-1-.8l-1.1-2.2c-.3-.5-.8-.8-1.3-.8h-4.1c-.6 0-1.1.3-1.3.8l-1.1 2.2c-.2.4-.5.7-1 .8-1.6.5-3.2 1.1-4.6 1.9-.4.2-.8.3-1.2.1l-2.3-.8c-.5-.2-1.1 0-1.5.4L5.9 8.8c-.4.4-.5 1-.4 1.5l.8 2.3c.1.4.1.8-.1 1.2-.8 1.5-1.5 3-1.9 4.7-.1.4-.4.8-.8 1l-2.1 1.1c-.5.3-.8.8-.8 1.3V26c0 .6.3 1.1.8 1.3l2.1 1.1c.4.2.7.5.8 1 .5 1.6 1.1 3.2 1.9 4.7.2.4.3.8.1 1.2l-.8 2.3c-.2.5 0 1.1.4 1.5L8.8 42c.4.4 1 .5 1.5.4l2.3-.8c.4-.1.8-.1 1.2.1 1.4.8 3 1.5 4.6 1.9.4.1.8.4 1 .8l1.1 2.2c.3.5.8.8 1.3.8h4.1c.6 0 1.1-.3 1.3-.8l1.1-2.2c.2-.4.5-.7 1-.8 1.6-.5 3.2-1.1 4.6-1.9.4-.2.8-.3 1.2-.1l2.3.8c.5.2 1.1 0 1.5-.4l2.9-2.9c.4-.4.5-1 .4-1.5l-.8-2.3c-.1-.4-.1-.8.1-1.2.8-1.5 1.5-3 1.9-4.7.1-.4.4-.8.8-1l2.1-1.1c.5-.3.8-.8.8-1.3v-4.1c.4-.5.1-1.1-.4-1.3zM24 41.5c-9.7 0-17.5-7.8-17.5-17.5S14.3 6.5 24 6.5 41.5 14.3 41.5 24 33.7 41.5 24 41.5z" fill-rule="evenodd"></path></svg>                </div>
    
                <div class="profile-stats">
    
                    <ul>
                        <li><span class="profile-stat-count">${data.posts.length}</span> posts</li>
                        <li><span class="profile-stat-count">${data.followers.length}</span> followers</li>
                        <li><span class="profile-stat-count">${data.following.length}</span> following</li>
                    </ul>
    
                </div>
    
                <div class="profile-bio">
    
                    <p><span class="profile-real-name">${data.first_name} ${data.last_name}</span> ${data.bio}</p>
    
                </div>
    
            </div>
            <!-- End of profile section -->
            <hr>
        </div>

        <main>

        <div class="container">
    
            <div class="gallery" id="gallery">
    
            </div>
            <!-- End of gallery -->
    
    
        </div>
        <!-- End of container -->
    
        </main>
        <!-- End of container -->
        
    </header>
    


</div>
    `

    fetch(`http://https://prouserr.pythonanywhere.com//api/list_user_posts/${user_id}`).then((resp) => resp.json()).then(function(data){
    gallery = document.getElementById('gallery')
    for(var i=0;i<data.length;i++){
        gallery.innerHTML += `
        <div class="gallery-item" tabindex="0">
        
        <img src="${data[i].image}" class="gallery-image" alt="">
    
        <div class="gallery-item-info" >
    
            <ul>
                <li class="gallery-item-likes"><span class="visually-hidden">Likes:</span><i class="fas fa-heart" aria-hidden="true"></i>❤️ ${data[i].likes.length}</li>
                <li class="gallery-item-comments"><span class="visually-hidden">Comments:</span><i class="fas fa-comment" aria-hidden="true"></i>💬 ${data[i].comments.length}</li>
            </ul>
    
        </div>
    
    </div>
        `
    }
    

})

}).catch(function(){display_blank_profile()})
}


function display_edit_profile(){
    fetch(`http://https://prouserr.pythonanywhere.com//api/get_profile/${user_id}`).then((resp) => resp.json()).then(function(data){
        console.log(data)
            my_container.innerHTML = `
            <br>
            
            <style>
                body{
                    color: #8e9194;
                    background-color: #f4f6f9;
                }
                .avatar-xl img {
                    width: 110px;
                }
                .rounded-circle {
                    border-radius: 50% !important;
                }
                img {
                    vertical-align: middle;
                    border-style: none;
                }
                .text-muted {
                    color: #aeb0b4 !important;
                }
                .text-muted {
                    font-weight: 300;
                }
                .form-control {
                    display: block;
                    width: 100%;
                    height: calc(1.5em + 0.75rem + 2px);
                    padding: 0.375rem 0.75rem;
                    font-size: 0.875rem;
                    font-weight: 400;
                    line-height: 1.5;
                    color: #4d5154;
                    background-color: #ffffff;
                    background-clip: padding-box;
                    border: 1px solid #eef0f3;
                    border-radius: 0.25rem;
                    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
                }
            </style>
            <div class="bg-white" style="width: 75%;margin-left: 12.5%;">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-12 col-lg-10 col-xl-8 mx-auto">
                        <div class="my-4">
                            <ul class="nav nav-tabs mb-4" id="myTab" role="tablist">
                                <li class="nav-item">
                                    <a class="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="false">Profile</a>
                                </li>
                            </ul>
                                <div class="row mt-5 align-items-center">
                                    <div class="col-md-3 text-center mb-5">
                                        <div class="avatar avatar-xl">
                                        <form enctype="multipart/form-data">
                                            <img src="${data.image}" class="rounded-circle" style="width: 200px" alt="" />
                                        </form>
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="row mb-4">
                                            <div class="col-md-7">

                                                
                                            </div>
                                            <div class="col">                                    
                                            <p class="small mb-0 text-muted">Help people discover your account by using the name you're known by: either your full name, nickname, or business name.</p>                                           
                                            </div>
                                        </div>
                                    </div>

                                    <p class="text-muted">
                                    Change Profile Picture:
                                </p>
                                <input type="file" id="image_input">
                                </div>
                                <hr class="my-4" />
                                <div class="form-group">
                                    <label for="inputUsername5">Username</label>
                                    <input type="text" class="form-control" id="username_input" placeholder="${data.username}" value="${data.username}"/>
                                </div>
                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label for="firstname">Firstname</label>
                                        <input type="text" id="firstname_input" class="form-control" placeholder="${data.first_name}" value="${data.first_name}"/>
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label for="lastname">Lastname</label>
                                        <input type="text" id="lastname_input" class="form-control" placeholder="${data.last_name}" value="${data.last_name}"/>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="inputEmail4">Email</label>
                                    <input type="email" class="form-control" id="email_input" placeholder="${data.email}" value="${data.email}"/>
                                </div>
                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label for="inputBio">Bio</label>
                                        <textarea class="form-control" id="bio_input" placeholder="${data.bio}">${data.bio}</textarea>
                                    </div>
                                </div>
                                <br>
                                <button type="submit" class="btn btn-primary" id="save_profile_btn" onclick="update_info()">Save Profile</button>
                                <hr class="my-4" />
                                <div class="row mb-4">
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label for="inputPassword4">Old Password</label>
                                            <input type="password" class="form-control" id="oldpassword_input" value="" />
                                        </div>
                                        <div class="form-group">
                                            <label for="inputPassword5">New Password</label>
                                            <input type="password" class="form-control" id="newpassword1_input" value="" />
                                        </div>
                                        <div class="form-group">
                                            <label for="inputPassword6">Confirm Password</label>
                                            <input type="password" class="form-control" id="newpassword2_input" value="" />
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <p class="mb-2">Password requirements</p>
                                        <p class="small text-muted mb-2">To create a new password, you have to meet all of the following requirements:</p>
                                        <ul class="small text-muted pl-4 mb-0">
                                            <li>Minimum 8 character</li>
                                            <li>At least one special character</li>
                                            <li>At least one number</li>
                                            <li>Can’t be the same as a previous password</li>
                                        </ul>
                                    </div>
                                </div>
                                <button type="submit" class="btn btn-primary" id="update_password_btn" onclick="update_password()">Update Password</button>
                        </div>
                    </div>
                </div>
                </div>
                </div>
            `
    })
}


function display_blank_profile(){
    my_container.innerHTML = `
    <br>
    
    <style>
        body{
            color: #8e9194;
            background-color: #f4f6f9;
        }
        .avatar-xl img {
            width: 110px;
        }
        .rounded-circle {
            border-radius: 50% !important;
        }
        img {
            vertical-align: middle;
            border-style: none;
        }
        .text-muted {
            color: #aeb0b4 !important;
        }
        .text-muted {
            font-weight: 300;
        }
        .form-control {
            display: block;
            width: 100%;
            height: calc(1.5em + 0.75rem + 2px);
            padding: 0.375rem 0.75rem;
            font-size: 0.875rem;
            font-weight: 400;
            line-height: 1.5;
            color: #4d5154;
            background-color: #ffffff;
            background-clip: padding-box;
            border: 1px solid #eef0f3;
            border-radius: 0.25rem;
            transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        }
    </style>
    <div class="bg-white" style="width: 75%;margin-left: 12.5%;">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-12 col-lg-10 col-xl-8 mx-auto">
                <div class="my-4">
                    <ul class="nav nav-tabs mb-4" id="myTab" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="false">Profile</a>
                        </li>
                    </ul>
                        <div class="row mt-5 align-items-center">
                            <div class="col">
                                <div class="row align-items-center">
                                    <div class="col-md-7">
                                        <h4 class="mb-1"></h4>
                                        <p class="small mb-3"><span class="badge badge-dark">New York, USA</span></p>
                                    </div>
                                </div>
                                <div class="row mb-4">
                                    <div class="col-md-7">
                                        <p class="text-muted">
                                            Change Profile Picture:
                                        </p>
                                        <input type="file" id="image_input" value="">
                                    </div>
                                    <div class="col">                                    
                                    <p class="small mb-0 text-muted">Help people discover your account by using the name you're known by: either your full name, nickname, or business name.</p>                                           
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr class="my-4" />
                        <div class="form-group">
                            <label for="inputUsername5">Username</label>
                            <input type="text" class="form-control" id="username_input" placeholder="" value=""/>
                        </div>
                        <div class="form-row">
                            <div class="form-group col-md-6">
                                <label for="firstname">Firstname</label>
                                <input type="text" id="firstname_input" class="form-control" placeholder="" value=""/>
                            </div>
                            <div class="form-group col-md-6">
                                <label for="lastname">Lastname</label>
                                <input type="text" id="lastname_input" class="form-control" placeholder="" value=""/>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="inputEmail4">Email</label>
                            <input type="email" class="form-control" id="email_input" placeholder="" value=""/>
                        </div>
                        <div class="form-row">
                            <div class="form-group col-md-6">
                                <label for="inputBio">Bio</label>
                                <textarea class="form-control" id="bio_input" placeholder=""></textarea>
                            </div>
                        </div>
                        <br>
                        <button type="submit" class="btn btn-primary" id="save_profile_btn" onclick="create_profile()">Save Profile</button>
                        <hr class="my-4" />
                        <div class="row mb-4">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="inputPassword4">Old Password</label>
                                    <input type="password" class="form-control" id="oldpassword_input" value="" />
                                </div>
                                <div class="form-group">
                                    <label for="inputPassword5">New Password</label>
                                    <input type="password" class="form-control" id="newpassword1_input" value="" />
                                </div>
                                <div class="form-group">
                                    <label for="inputPassword6">Confirm Password</label>
                                    <input type="password" class="form-control" id="newpassword2_input" value="" />
                                </div>
                            </div>
                            <div class="col-md-6">
                                <p class="mb-2">Password requirements</p>
                                <p class="small text-muted mb-2">To create a new password, you have to meet all of the following requirements:</p>
                                <ul class="small text-muted pl-4 mb-0">
                                    <li>Minimum 8 character</li>
                                    <li>At least one special character</li>
                                    <li>At least one number</li>
                                    <li>Can’t be the same as a previous password</li>
                                </ul>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary" id="update_password_btn" onclick="update_password()">Update Password</button>
                </div>
            </div>
        </div>
        </div>
        </div>
    `
}


function update_user(){
    firstname = document.getElementById('firstname_input').value
    lastname = document.getElementById('lastname_input').value
    email = document.getElementById('email_input').value
    username = document.getElementById('username_input').value

    fetch(`http://https://prouserr.pythonanywhere.com//api/update_user/`, {
        method:'POST', 
        headers:{
            'Content-type':'application/json',
            'X-CSRFToken':csrftoken,
        },
        body:JSON.stringify({'first_name':firstname, 'last_name':lastname, 'email':email,'username':username,'password':' ', 'posts': []})
    })
}


function update_profile(){
    bio = document.getElementById('bio_input').value
    image = document.getElementById('image_input').files[0]
    const formData  = new FormData();
    formData.append('bio', bio)
    formData.append('image', image)
    formData.append('user', user_id)


    fetch(`http://https://prouserr.pythonanywhere.com//api/update_profile/`, {
        method:'POST', 
        headers:{
            'X-CSRFToken':csrftoken,
        },
        body:formData
    })
}


function update_info(){
    update_user()
    update_profile()
}


function create_profile(){
    update_user()
    bio = document.getElementById('bio_input').value
    image = document.getElementById('image_input').files[0]
    const formData  = new FormData();
    formData.append('bio', bio)
    formData.append('image', image)
    formData.append('user', user_id)

    fetch(`http://https://prouserr.pythonanywhere.com//api/create_profile/`, {
        method:'POST', 
        headers:{
            'X-CSRFToken':csrftoken,
        },
        body:formData
    })
}


function update_password(){
    oldpassword = document.getElementById('oldpassword_input').value
    newpassword1 = document.getElementById('newpassword1_input').value
    newpassword2 = document.getElementById('newpassword2_input').value
    console.log(newpassword1)

    if(newpassword1==newpassword2){
        fetch(`http://https://prouserr.pythonanywhere.com//api/update_password/`, {
            method:'POST', 
            headers:{
                'Content-type':'application/json',
                'X-CSRFToken':csrftoken,
            },
            body:JSON.stringify({'password':newpassword1})
        })}
}


function logout(){
    fetch(`http://https://prouserr.pythonanywhere.com//api/logout_user`).then(function(){window.location.reload()})
    
}


function show_login_activity(user_id){
    fetch(`http://https://prouserr.pythonanywhere.com//api/get_profile/${user_id}`).then((resp) => resp.json()).then(function(data){
        if(show_login_activity_flag){
            date_joined = new Date(data.date_joined).toDateString()
            last_login = new Date(data.last_login).toDateString()
            div = document.getElementsByClassName('modal-body')[0]
            div.innerHTML += `
            <h2>Date joined:<br><h3>${date_joined}</h3></h2>
            <h2>Last login:<br><h3>${last_login}</h3></h2>
            `
            show_login_activity_flag = false
        }

    })

}


display_profile()