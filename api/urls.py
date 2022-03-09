from django.urls import path
from django.urls.conf import include
from .views import *

app_name = 'api'
urlpatterns = [
    path('register_user/', register_user, name='register_user'),
    path('login_user/', login_user, name='login_user'),
    path('logout_user/', logout_user, name='logout_user'),
    path('list_users/', list_users, name='list_user'),
    path('update_user/', update_user, name='update_user'),
    path('update_password/', update_password, name='update_password'),
    path('update_profile/', update_profile, name='update_profile'),
    path('follow_user/<int:user_id>', follow_user, name='follow_user'),
    path('unfollow_user/<int:user_id>', unfollow_user, name='unfollow_user'),
    path('create_profile/', create_profile, name='create_profile'),
    path('get_profile/<int:user_id>', get_profile, name='get_profile'),
    path('get_comments/<int:post_id>', get_comments, name='get_comments'),
    path('list_user_posts/<int:user_id>', list_user_posts, name='list_user_posts'),
    path('list_messages/<int:sender_id>', list_messages, name='list_messages'),
    path('add_message/', add_message, name='add_message'),
    path('discover_posts/', discover_posts, name='discover_posts'),
    path('news_feed/', news_feed, name='news_feed'),
    path('create_post/', create_post, name='create_post'),
    path('update_post/<int:id>', update_post, name='update_post'),
    path('delete_post/<int:id>', delete_post, name='delete_post'),
    path('add_comment/<int:post_id>', add_comment, name='add_comment'),
    path('add_like/<int:post_id>', add_like, name='add_like'),
    path('delete_like/<int:like_id>', delete_like, name='delete_like'),
    path('delete_comment/<int:id>', delete_comment, name='delete_comment'),
]