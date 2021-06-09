from django.db import models


class SteelPlant(models.Model):
    name = models.CharField(max_length=100, null=True, blank=True)
    address = models.CharField(max_length=100, null=True, blank=True)
    remark = models.CharField(max_length=100, null=True, blank=True)
    createDateTime = models.DateTimeField('date created')
