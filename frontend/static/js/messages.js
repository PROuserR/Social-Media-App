messages_img = document.getElementById('messages')
messages.src = '/static/bootstrap-icons/chat-dots-fill.svg'

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

var my_container = document.getElementById('my_container')
var my_id = document.getElementById('my_id').value
var send_audio = new Audio('/static/sound/send.mp3');
var receive_audio = new Audio('/static/sound/receive.mp3');

var messages_len = 0
var sender_id2 = 0
var send_flag = false

fetch(`http://127.0.0.1:8000/api/get_profile/${my_id}`).then((resp) => resp.json()).then(function(profile){
    my_container.innerHTML = `    
    <div class="container py-5 px-4">
    <!-- For demo purpose-->
    <header class="text-center">
      <h1 class="display-4 text-white">${profile.username} chats</h1>
    </header>
    
    <div class="row rounded-lg overflow-hidden shadow">
      <!-- Users box-->
      <div class="col-5 px-0">
        <div class="bg-white">
    
          <div class="bg-gray px-4 py-2 bg-light">
            <p class="h5 mb-0 py-1">Recent</p>
          </div>
    
          <div class="messages-box" id="messages-box">

          </div>
        </div>
      </div>
      <!-- Chat Box-->
      <div class="col-7 px-0" id="chat-box"></div>

    </div>
    </div>
    `
    messages_box = document.getElementById('messages-box')
    for(following_user in profile.following){
        fetch(`http://127.0.0.1:8000/api/get_profile/${profile.following[following_user]}`).then((resp) => resp.json()).then(function(following_profile){

        messages_box.innerHTML += `
        <a href="#" class="list-group-item list-group-item-action list-group-item-light rounded-0" onclick="fill_messages(${following_profile.user})">
        <div class="media"><img src="${following_profile.image}" alt="user" width="50" class="rounded-circle">
          <div class="media-body ml-4">
            <div class="d-flex align-items-center justify-content-between mb-1">
              <h6 class="mb-0">${following_profile.username}</h6>
            </div>
          </div>
        </div>
      </a>
        `
    })
    }
})

function fill_messages(sender_id){
    sender_id2 = sender_id
    chat_box = document.getElementById('chat-box')
    chat_box.innerHTML = `
    <div class="px-4 py-5 chat-box bg-white" id="chats-container">
    </div>
    `

    fetch(`http://127.0.0.1:8000/api/list_messages/${sender_id}`).then((resp) => resp.json()).then(function(messages){
      messages_len = messages.length
        for(i in messages){
          console.log(messages[i])
            chats_container = document.getElementById('chats-container')
            now = new Date()
            py_date = new Date(messages[i].date_added)
            if(parseInt(my_id) == messages[i].sender){
                chats_container.innerHTML += `
                <!-- Sender Message-->
                <div class="media w-50 ml-auto mb-3" style="margin-left:50%">
                  <div class="media-body">
                    <div class="bg-primary rounded py-2 px-3 mb-2">
                      <p class="text-small mb-0 text-white">${messages[i].content}</p>
                    </div>
                    <p class="small text-muted">${time_delta(now, py_date)}</p>
                  </div>
                </div>
            `
            }
            else{
                chats_container.innerHTML += `
                <!-- Receiver Message-->
                <div class="media w-50 mb-3">
                  <div class="media-body ml-3">
                    <div class="bg-light rounded py-2 px-3 mb-2">
                      <p class="text-small mb-0 text-muted">${messages[i].content}</p>
                    </div>
                    <p class="small text-muted">${time_delta(now, py_date)}</p>
                  </div>
                </div>
            
            `
            }
        }
    })

    chat_box.innerHTML += `
    <div class="input-group bg-light">
        <input type="text" id="message-input" placeholder="Type a message" aria-describedby="button-addon2" class="form-control rounded-0 border-0 py-4 bg-light">
        <div class="input-group-append">
        <button id="button-send" type="submit" class="btn btn-link"><img src="/static/bootstrap-icons/send.svg"></button>
        </div>
    </div>
    `

    button_send = document.getElementById('button-send')
    button_send.addEventListener('click', function(){
        send_message(sender_id, document.getElementById('message-input').value)

    })
}

function send_message(recevier_id, message){
    fetch(`http://127.0.0.1:8000/api/add_message/`, {
        method:'POST', 
        headers:{
            'Content-type':'application/json',
            'X-CSRFToken':csrftoken,
        },
        body:JSON.stringify({'content': message, 'sender': my_id, 'receiver':recevier_id})}
    )
    chats_container = document.getElementById('chats-container')
    now = new Date()
    py_date = new Date()

    chats_container.innerHTML += `
        <!-- Sender Message-->
        <div class="media w-50 ml-auto mb-3" style="margin-left:50%">
          <div class="media-body">
            <div class="bg-primary rounded py-2 px-3 mb-2">
              <p class="text-small mb-0 text-white">${message}</p>
            </div>
            <p class="small text-muted">${time_delta(now, py_date)}</p>
          </div>
        </div>
    `
    send_audio.play();
    document.getElementById('message-input').value = ''
    send_flag = true
    message_tmp = message
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

var intervalId = window.setInterval(function(){
    fetch(`http://127.0.0.1:8000/api/list_messages/${sender_id2}`).then((resp) => resp.json()).then(function(messages){
      if(messages_len != messages.length){
        if(parseInt(my_id) != messages.slice(-1)[0].sender){
          chats_container = document.getElementById('chats-container')
          now = new Date()
          py_date = new Date()


          chats_container.innerHTML += `
          <!-- Receiver Message-->
          <div class="media w-50 mb-3">
            <div class="media-body ml-3">
              <div class="bg-light rounded py-2 px-3 mb-2">
                <p class="text-small mb-0 text-muted">${ messages.slice(-1)[0].content}</p>
              </div>
              <p class="small text-muted">${time_delta(now, py_date)}</p>
            </div>
          </div>
      `
      messages_len = messages.length
      receive_audio.play()
        }
      }
  })
}, 2000);