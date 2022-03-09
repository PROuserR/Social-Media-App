from django.urls import path
from django.urls.conf import include
from .views import *

app_name = 'frontend'
urlpatterns = [
    path('', redirect_home, name='redirect_home'),
    path('home/', home, name='home'),
    path('create_post/', create_post, name='create_post'),
    path('discover/', discover, name='discover'),
    path('messages/', messages, name='messages'),
    path('notifications/', notifications, name='notifications'),
    path('my_profile/', my_profile, name='my_profile'),
    path('user_profile/<int:user_id>', user_profile, name='user_profile'),
    path('login/', login, name="login"),
    path('register/', register, name="register")
]
