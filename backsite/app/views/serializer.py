from rest_framework import serializers
from ..models.steel_plant import SteelPlant
from ..models.intermediary import Intermediary
from ..models.payment import Payment
from ..models.truck import Truck
from ..models.weight_memo_in import WeightMemoIn
from ..models.weight_memo_out import WeightMemoOut
from ..models.user import User


class IntermediarySerializer(serializers.ModelSerializer):
    class Meta:  # 写一个内部类
        model = Intermediary  # 该序列化类跟哪个表建立关系
        fields = '__all__'  # 序列化全部字段


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:  # 写一个内部类
        model = Payment  # 该序列化类跟哪个表建立关系
        fields = '__all__'  # 序列化全部字段


class TruckSerializer(serializers.ModelSerializer):
    class Meta:  # 写一个内部类
        model = Truck  # 该序列化类跟哪个表建立关系
        fields = '__all__'  # 序列化全部字段


class UserSerializer(serializers.ModelSerializer):
    class Meta:  # 写一个内部类
        model = User  # 该序列化类跟哪个表建立关系
        fields = '__all__'  # 序列化全部字段


class WeightMemoInSerializer(serializers.ModelSerializer):
    class Meta:  # 写一个内部类
        model = WeightMemoIn  # 该序列化类跟哪个表建立关系
        fields = '__all__'  # 序列化全部字段
        depth = 1


class WeightMemoOutSerializer(serializers.ModelSerializer):
    class Meta:  # 写一个内部类
        model = WeightMemoOut  # 该序列化类跟哪个表建立关系
        fields = '__all__'  # 序列化全部字段
        depth = 1


class SteelPlantSerializer(serializers.ModelSerializer):
    class Meta:  # 写一个内部类
        model = SteelPlant  # 该序列化类跟哪个表建立关系
        fields = '__all__'  # 序列化全部字段
