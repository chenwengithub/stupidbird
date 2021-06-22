import json

from datetime import datetime
from django.http import HttpResponse
from django.http.response import JsonResponse
from ..models.truck import Truck
from .serializer import TruckSerializer
from .service import query


def action(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        print(body)
        method = body['method']
        if method == 'post':
            return add(body['data'])
        elif method == 'delete':
            return remove(body['key'])
        elif method == 'update':
            return update(body['key'], body['data'])
    else:
        return find(request)


def find(request):
    return JsonResponse(query(request, Truck.objects.all(), TruckSerializer), safe=False)


def add(data):
    data = Truck(car_number=data['car_number'],
                 driver_name=data['driver_name'],
                 driver_tel=data['driver_tel'],
                 remark=data['remark'],
                 createDateTime=datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    data.save()
    return HttpResponse('success')


def remove(key):
    Truck.objects.get(id=key).delete()
    return HttpResponse('success')


def update(key, data):
    obj = Truck.objects.get(id=key)
    print(obj)
    obj.car_number = data['car_number']
    obj.driver_name = data['driver_name']
    obj.driver_tel = data['driver_tel']
    obj.remark = data['remark']
    obj.save()
    return HttpResponse('success')
