import json

from datetime import datetime
from django.http import HttpResponse
from django.http.response import JsonResponse

from ..models import Goods
from ..models.steel_plant import SteelPlant
from app.utils.serializer import SteelPlantSerializer
from app.service.service import query


def action(request):
    if request.method == 'POST':
        body = json.loads(request.body)
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
    return JsonResponse(query(request, SteelPlant.objects.all(), SteelPlantSerializer), safe=False)


def add(data):
    obj = SteelPlant(createDateTime=datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    for key, value in data.items():
        if key == 'goods':
            setattr(obj, key, Goods.objects.get(pk=value))
        else:
            setattr(obj, key, value)
    data.save()
    return HttpResponse('success')


def remove(key):
    SteelPlant.objects.get(id=key).delete()
    return HttpResponse('success')


def update(key, data):
    obj = SteelPlant.objects.get(id=key)
    for key, value in data.items():
        if key == 'goods':
            setattr(obj, key, Goods.objects.get(pk=value))
        else:
            setattr(obj, key, value)
    data.save()
    return HttpResponse('success')
