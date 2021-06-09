from django.db import models


class Intermediary(models.Model):
    name = models.CharField(max_length=100, null=True, blank=True)
    tel = models.CharField(max_length=100, null=True, blank=True)
    remark = models.CharField(max_length=100, null=True, blank=True)
    createDateTime = models.DateTimeField('date created')
