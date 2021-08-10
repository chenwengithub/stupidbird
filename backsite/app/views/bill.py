import json

from datetime import datetime
from django.http import HttpResponse
from django.http.response import JsonResponse
from ..models.bill import Bill
from .serializer import BillSerializer
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
    return JsonResponse(query(request, Bill.objects.all(), BillSerializer), safe=False)


def add(data):
    data = Bill(type=data['type'],
                reason=data['reason'],
                money=data['money'],
                createDateTime=datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    data.save()
    return HttpResponse('success')


def remove(key):
    Bill.objects.get(id=key).delete()
    return HttpResponse('success')


def update(key, data):
    obj = Bill.objects.get(id=key)
    print(obj)
    obj.type = data['type']
    obj.reason = data['reason']
    obj.money = data['money']
    obj.save()
    return HttpResponse('success')
