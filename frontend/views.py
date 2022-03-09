from django.http import request
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.shortcuts import redirect

# Create your views here.
@login_required
def redirect_home(request):
    return redirect('frontend:home')
    
@login_required
def home(request):
    return render(request, 'home.html')


@login_required
def create_post(request):
    return render(request, 'create_post.html')


@login_required
def discover(request):
    return render(request, 'discover.html')


@login_required
def messages(request):
    return render(request, 'messages.html')


@login_required
def notifications(request):
    return render(request, 'notifications.html')


@login_required
def my_profile(request):
    return render(request, 'my_profile.html')


@login_required
def user_profile(request, user_id):
    return render(request, 'user_profile.html', context={'user_id': user_id})


def login(request):
    return render(request, 'login.html')


def register(request):
    return render(request, 'register.html')