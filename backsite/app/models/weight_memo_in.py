from django.db import models

from .goods import Goods
from .weight_memo_out import WeightMemoOut
from .payment import Payment


class WeightMemoIn(models.Model):
    payment = models.ForeignKey(Payment, on_delete=models.CASCADE, null=True, blank=True)  # 付款信息
    weight_memo_out = models.ForeignKey(WeightMemoOut, on_delete=models.CASCADE, null=True, blank=True)  # 对应的出库单
    goods = models.ForeignKey(Goods, on_delete=models.CASCADE, null=True, blank=True)  # 货物
    estimated_profit = models.IntegerField(null=True, blank=True)   # 预估利润
    reality_profit = models.IntegerField(null=True, blank=True)  # 实际利润
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
    is_sold = models.BooleanField(null=True, blank=True)
    remark = models.CharField(max_length=200, null=True, blank=True)
    createDateTime = models.DateTimeField(auto_now_add=True)
