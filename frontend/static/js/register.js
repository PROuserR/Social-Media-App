register_btn = document.getElementById('register-btn')

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

register_btn.addEventListener('click', function(){
    username = document.getElementById('username-input').value
    email = document.getElementById('email-input').value
    password1 = document.getElementById('password-input1').value
    password2 = document.getElementById('password-input2').value

    if(password1 == password2){
        fetch(`http://https://prouserr.pythonanywhere.com//api/register_user/`, {
            method:'POST', 
            headers:{
                'Content-type':'application/json',
                'X-CSRFToken':csrftoken,
            },
            body:JSON.stringify({'username':username,'password':password1, 'email': email})
        }).then(window.location.href = "http://https://prouserr.pythonanywhere.com//home")
    }
})