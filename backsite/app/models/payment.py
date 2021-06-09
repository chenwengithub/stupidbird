from django.db import models


class Payment(models.Model):
    amount_wechat = models.IntegerField(null=True, blank=True)
    amount_cash = models.IntegerField(null=True, blank=True)
    amount_bank = models.IntegerField(null=True, blank=True)
    amount_iou = models.IntegerField(null=True, blank=True)
    amount_total = models.IntegerField(null=True, blank=True)
    remark = models.CharField(max_length=200)
    createDateTime = models.CharField(max_length=200)
