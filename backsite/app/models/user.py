from django.db import models


class User(models.Model):
    name = models.CharField(max_length=100)
    account = models.CharField(max_length=100)
    psw = models.CharField(max_length=100)
    createDateTime = models.DateTimeField('date created')
