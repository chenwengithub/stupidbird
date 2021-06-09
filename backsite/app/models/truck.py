from django.db import models


class Truck(models.Model):
    car_number = models.CharField(max_length=100, null=True, blank=True)
    driver_name = models.CharField(max_length=100, null=True, blank=True)
    driver_tel = models.CharField(max_length=100, null=True, blank=True)
    remark = models.CharField(max_length=100, null=True, blank=True)
    createDateTime = models.DateTimeField('date created')
