from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from django.shortcuts import redirect
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import *
from .models import *
import random

user_id = None
# Create your views here.
@api_view(['POST'])
def register_user(request):
    username = request.data['username']
    email = request.data['email']
    password = request.data['password']
    
    user = User.objects.create_user(username, email, password)

    if user:
        login(request, user)
        print(user)
        return redirect('frontend:home')
    else:
        print('Register error')
        return Response('Register error')


@api_view(['POST'])
def login_user(request):
    username = request.data['username']
    password = request.data['password']
    user = authenticate(request, username=username, password=password)

    if user is not None:
        login(request, user)
        print(user)
        return Response('Auth success')
    else:
        print('Auth error')
        return Response('Login error')


@api_view(['GET'])
def logout_user(request):
    logout(request)

    return redirect('frontend:login')


@api_view(['GET'])
def list_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def list_messages(request, sender_id):
    messages = Message.objects.filter(sender=sender_id, receiver=request.user.id) | Message.objects.filter(sender=request.user.id, receiver=sender_id)
    messages = messages.order_by('date_added')
    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def add_message(request):
    serializer = MessageSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)


@login_required
@api_view(['POST'])
def update_user(request):
    user = request.user
    serializer = UserSerializer(instance=user, data=request.data)
    
    if serializer.is_valid():
        serializer.save()
    else:
        print(serializer.errors)
        return Response(serializer.errors)
        
    return Response(serializer.data)


@login_required
@api_view(['POST','GET'])
def update_profile(request):
    profile = Profile.objects.get(user=request.user.id)
    serializer = ProfileSerializer(instance=profile, data=request.data)
    if serializer.is_valid():
        serializer.save()
    else:
        print(serializer.errors)
        return Response(serializer.errors)

    return Response(serializer.data)


@login_required
@api_view(['POST'])
def follow_user(request, user_id):
    following_user = Profile.objects.get(user=request.user)
    followed_user = Profile.objects.get(user=User.objects.get(id=user_id))

    following = following_user.following
    following.add(user_id)

    followers = followed_user.followers
    followers.add(request.user.id)

    followed_user.save()
    followed_user.save()

    return Response('Successfully completed!')


@api_view(['POST'])
def unfollow_user(request, user_id):
    following_user = Profile.objects.get(user=request.user)
    followed_user = Profile.objects.get(user=User.objects.get(id=user_id))

    following = following_user.following
    following.remove(User.objects.get(id=user_id))

    followers = followed_user.followers
    followers.remove(request.user)

    followed_user.save()
    followed_user.save()

    return Response('Successfully completed!')


@login_required
@api_view(['POST'])
def create_profile(request):
    serializer = ProfileSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save()
    else:
        print((serializer.errors))
        return Response(serializer.errors)
    
    return Response(serializer.data)


@login_required
@api_view(['POST'])
def update_password(request):
    user = request.user
    print('NEW PASSWORD:', request.data['password'])
    user.set_password(request.data['password'])
    user.save()
    return Response('Password changed')    
    
    
@login_required
@api_view(['GET'])
def get_profile(request, user_id):
    profile = Profile.objects.get(user=user_id)
    profile_serializer = ProfileSerializer(profile)
    
    user = User.objects.get(id=user_id)
    user_serializer = UserSerializer(user)
    
    final_data = {}
    for key in profile_serializer.data.keys():
        final_data[key] = profile_serializer.data[key]
        
    for key in user_serializer.data.keys():
        final_data[key] = user_serializer.data[key]
    
    return Response(final_data)


@login_required
@api_view(['GET'])
def get_comments(request, post_id):
    post = Post.objects.get(id=post_id)
    post_comments = post.comments
    comments = []
    for comment in post_comments.values():
        comments.append(comment)

    return Response(comments)


@login_required
@api_view(['GET'])
def list_user_posts(request, user_id):
    user = User.objects.get(id=user_id)
    posts = Post.objects.filter(owner=user)
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)


@login_required
@api_view(['GET'])
def discover_posts(request):
    posts = Post.objects.all()
    random_posts = []
    if len(posts) < 10:
        for i in range(len(posts)):
            random_posts.append(random.choice(posts))
    else:
        for i in range(10):
            random_posts.append(random.choice(posts))

    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

@login_required
@api_view(['GET'])
def news_feed(request):
    profile = Profile.objects.get(user=request.user.id)
    following = profile.following
    following_ids = []
    for following in following.values():
        following_ids.append(following['id'])
        

    posts = Post.objects.all()
    final_posts = []
    for post in posts:
        if post.owner.id in following_ids:
            final_posts.append(post)
    serializer = PostSerializer(final_posts, many=True)
    print(serializer.data)
    return Response(serializer.data)



@login_required
@api_view(['POST'])
def create_post(request):
    serializer = PostSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save(owner=request.user)
    else:
            return Response(serializer.errors)
        
    return Response(serializer.data)
        
        
@login_required
@api_view(['GET', 'POST'])
def update_post(request, id):
    post = Post.objects.get(id=id)
    
    if request.method == 'GET':
        serializer = PostSerializer(instance=post)
    else:
        serializer = PostSerializer(instance=post, data=request.data)
        
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(serializer.errors)
            
    return Response(serializer.data)


@login_required
@api_view(['POST'])
def delete_post(request, id):
    post = Post.objects.get(id=id)
    post.delete()
            
    return Response('Post deleted!')


@login_required
@api_view(['POST'])
def add_comment(request, post_id):
    serializer = CommentSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save()
        post = Post.objects.get(id=post_id)
        post.comments.add(serializer.data['id'])
        post.save()
        return Response(serializer.data)
    else:
        print(serializer.errors)
        return Response(serializer.errors)
    
    
@login_required
@api_view(['POST'])
def add_like(request, post_id):
    serializer = LikeSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save()
        print(serializer.data)
        post = Post.objects.get(id=post_id)
        post.save()
        post.likes.add(serializer.data['id'])
        post.save()
        return Response(serializer.data)
    else:
        print(serializer.errors)
        return Response(serializer.errors)
    
    
@login_required
@api_view(['DELETE'])
def delete_like(request, like_id):
    like = Like.objects.get(id=like_id)
    like.delete()
    return Response('Like deleted!')
  

@login_required
@api_view(['DELETE'])
def delete_comment(request, id):
    comment = Comment.objects.get(id=id)
    comment.delete()
    return Response('Comment deleted!')
