from django.db import models
from .payment import Payment


class WeightMemoIn(models.Model):
    payment = models.ForeignKey(Payment, on_delete=models.CASCADE, null=True, blank=True)  # 付款信息
    gross_weight = models.IntegerField(null=True, blank=True)
    body_weight = models.IntegerField(null=True, blank=True)
    deduct_weight = models.IntegerField(null=True, blank=True)
    legal_weight = models.IntegerField(null=True, blank=True)
    legal_prise = models.FloatField(null=True, blank=True)
    status = models.CharField(max_length=100, null=True, blank=True)
    account_payable = models.IntegerField(null=True, blank=True)
    actual_payment = models.IntegerField(null=True, blank=True)
    account_payable_text = models.CharField(max_length=100, null=True, blank=True)
    is_done = models.BooleanField(null=True, blank=True)
    remark = models.CharField(max_length=200, null=True, blank=True)
    createDateTime = models.DateTimeField('date created')
