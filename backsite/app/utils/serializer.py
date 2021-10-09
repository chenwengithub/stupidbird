from rest_framework import serializers
from app.models.steel_plant import SteelPlant
from app.models.intermediary import Intermediary
from app.models.payment import Payment
from app.models.truck import Truck
from app.models.weight_memo_in import WeightMemoIn
from app.models.weight_memo_out import WeightMemoOut
from app.models.bill import Bill
from app.models.user import User
from app.models.goods import Goods


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


class GoodsSerializer(serializers.ModelSerializer):
    class Meta:  # 写一个内部类
        model = Goods  # 该序列化类跟哪个表建立关系
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


class BillSerializer(serializers.ModelSerializer):
    class Meta:  # 写一个内部类
        model = Bill  # 该序列化类跟哪个表建立关系
        fields = '__all__'  # 序列化全部字段
