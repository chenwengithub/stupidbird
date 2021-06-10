import json

from datetime import datetime
from django.http import HttpResponse
from django.http.response import JsonResponse
from ..models.intermediary import Intermediary
from .serializer import IntermediarySerializer
from .service import query


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
    return JsonResponse(query(request, Intermediary.objects.all(), IntermediarySerializer), safe=False)


def add(data):
    data = Intermediary(name=data['name'], tel=data['tel'], remark=data['remark'],
                        createDateTime=datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    data.save()
    return HttpResponse('success')


def remove(key):
    Intermediary.objects.get(id=key).delete()
    return HttpResponse('success')


def update(key, data):
    obj = Intermediary.objects.get(id=key)
    obj.name = data['name']
    obj.tel = data['tel']
    obj.remark = data['remark']
    obj.save()
    return HttpResponse('success')
