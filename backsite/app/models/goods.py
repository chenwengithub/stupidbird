from django.db import models


class Goods(models.Model):
    name = models.CharField(max_length=100, null=True, blank=True)
    prise_in_min = models.FloatField(null=True, blank=True)
    prise_in_max = models.FloatField(null=True, blank=True)
    prise_out = models.IntegerField(null=True, blank=True)
