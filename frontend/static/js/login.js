login_btn = document.getElementById('login-btn')

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

login_btn.addEventListener('click', function(){
    username = document.getElementById('username-input').value
    password = document.getElementById('password-input').value

    fetch(`http://127.0.0.1:8000/api/login_user/`, {
        method:'POST', 
        headers:{
            'Content-type':'application/json',
            'X-CSRFToken':csrftoken,
        },
        body:JSON.stringify({'username':username,'password':password})
    }).then(resp => resp.json()).then(function(data){
        if(data=='Auth success')
        window.location.href = `http://127.0.0.1:8000/home/`
    })
    
})