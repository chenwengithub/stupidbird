from django.db import models
from .goods import Goods


class SteelPlant(models.Model):
    name = models.CharField(max_length=100, null=True, blank=True)
    address = models.CharField(max_length=100, null=True, blank=True)
    remark = models.CharField(max_length=100, null=True, blank=True)
    goods = models.ForeignKey(Goods, on_delete=models.CASCADE, null=True, blank=True)  # 货物
    createDateTime = models.DateTimeField('date created')
