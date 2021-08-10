from django.db import models


class Bill(models.Model):
    type = models.CharField(max_length=200, null=True, blank=True)
    reason = models.CharField(max_length=200, null=True, blank=True)
    money = models.IntegerField(null=True, blank=True)
    createDateTime = models.CharField(max_length=200)
