from django.db import models
from .steel_plant import SteelPlant
from .truck import Truck
from .intermediary import Intermediary


class WeightMemoOut(models.Model):
    intermediary = models.ForeignKey(Intermediary, on_delete=models.CASCADE)  # 中间人
    steel_plant = models.ForeignKey(SteelPlant, on_delete=models.CASCADE)  # 钢厂
    truck = models.ForeignKey(Truck, on_delete=models.CASCADE)  # 货车
    gross_weight_own = models.FloatField(null=True, blank=True)  # 己方毛重
    gross_weight_opposite = models.FloatField(null=True, blank=True)  # 对方毛重
    body_weight_own = models.FloatField(null=True, blank=True)  # 己方皮重
    body_weight_opposite = models.FloatField(null=True, blank=True)  # 对方皮重
    deduct_weight = models.FloatField(null=True, blank=True)  # 对方扣除
    legal_weight_own = models.FloatField(null=True, blank=True)  # 己方净重
    legal_weight_own_text = models.CharField(max_length=100, null=True, blank=True)  # 己方净重
    legal_weight_opposite = models.FloatField(null=True, blank=True)  # 对方净重
    legal_weight_opposite_text = models.CharField(max_length=100, null=True, blank=True)  # 对方净重
    agreed_prise = models.IntegerField(null=True, blank=True)  # 商定价格
    actual_prise = models.IntegerField(null=True, blank=True)  # 对方价格
    expected_payment = models.IntegerField(null=True, blank=True)  # 预期金额
    expected_payment_text = models.CharField(max_length=100, null=True, blank=True)  # 预期金额
    opposite_payment = models.IntegerField(null=True, blank=True)  # 对方金额
    opposite_payment_text = models.CharField(max_length=100, null=True, blank=True)  # 对方金额
    advance_payment = models.IntegerField(null=True, blank=True)  # 预付款
    rest_payment = models.IntegerField(null=True, blank=True)  # 尾款
    actual_payment = models.IntegerField(null=True, blank=True)  # 实付款
    status = models.CharField(max_length=100, null=True, blank=True)  # 状态
    payment_done = models.BooleanField(null=True, blank=True)  # 是否结清
    remark = models.CharField(max_length=200, null=True, blank=True)  # 备注
    createDateTime = models.DateTimeField('date created')  # 创建时间
    complete_datetime = models.DateTimeField(null=True, blank=True)  # 完成时间
    arrival_datetime = models.DateTimeField(null=True, blank=True)  # 到达时间
    advance_payment_datetime = models.DateTimeField(null=True, blank=True)  # 预付款时间
    rest_payment_datetime = models.DateTimeField(null=True, blank=True)  # 尾款时间
