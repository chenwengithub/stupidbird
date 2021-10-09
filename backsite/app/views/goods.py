import json

from django.http import HttpResponse
from django.http.response import JsonResponse
from app.models.goods import Goods
from app.utils.serializer import GoodsSerializer
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
    return JsonResponse(query(request, Goods.objects.all(), GoodsSerializer), safe=False)


def add(data):
    data = Goods(name=data['name'],
                 prise_in_min=data['prise_in_min'],
                 prise_in_max=data['prise_in_max'],
                 prise_out=data['prise_out'])
    data.save()
    return HttpResponse('success')


def remove(key):
    Goods.objects.get(id=key).delete()
    return HttpResponse('success')


def update(key, data):
    obj = Goods.objects.get(id=key)
    obj.name = data['name']
    obj.prise_in_min = data['prise_in_min']
    obj.prise_in_max = data['prise_in_max']
    obj.prise_out = data['prise_out']
    obj.save()
    return HttpResponse('success')
