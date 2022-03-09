create_post_img = document.getElementById('create_post')
create_post_img.src = '/static/bootstrap-icons/plus-circle-fill.svg'

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
var user_id = document.getElementById('my_id').value

function create_post(){
    caption = document.getElementById('caption_input').value
    image = document.getElementById('image_input').files[0]
    const formData  = new FormData();
    formData.append('caption', caption)
    formData.append('image', image)
    formData.append('owner', user_id)

    fetch(`http://https://prouserr.pythonanywhere.com//api/create_post/`, {
        method:'POST', 
        headers:{
            'X-CSRFToken':csrftoken,
        },
        body:formData
    })
}