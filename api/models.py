from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Comment(models.Model):
    commenter = models.ForeignKey('auth.User', related_name='commenter', on_delete=models.CASCADE)
    content = models.TextField()
    date_added = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.content
    
    
class Like(models.Model):
    liker = models.ForeignKey('auth.User', related_name='liker', on_delete=models.CASCADE)
    date_added = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.liker.username


class Post(models.Model):
    likes = models.ManyToManyField(Like, related_name='likes', blank=True)
    comments = models.ManyToManyField(Comment, related_name='comments', blank=True)
    image = models.ImageField(blank=True, null=True)
    date_added = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey('auth.User', related_name='posts', on_delete=models.CASCADE)
    caption = models.TextField(blank=True, default='post')
    
    
    def __str__(self):
        return self.caption

    
class Message(models.Model):
    content = models.TextField()
    date_added = models.DateTimeField(auto_now_add=True)
    sender = models.ForeignKey('auth.User', related_name='sender', on_delete=models.CASCADE)
    receiver = models.ForeignKey('auth.User', related_name='receiver', on_delete=models.CASCADE)
    
    def __str__(self):
        return self.content
    
    
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.ImageField(blank=True, null=True)
    bio = models.TextField()
    followers = models.ManyToManyField(User, related_name='followers', blank=True)
    following = models.ManyToManyField(User, related_name='following', blank=True)
    
    def __str__(self):
        return self.user.username