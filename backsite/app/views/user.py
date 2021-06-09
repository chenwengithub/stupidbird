import json

from datetime import datetime
from django.http import HttpResponse
from ..models.user import User
from .serializer import UserSerializer
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
    return query(request, User.objects.all(), UserSerializer)


def current(request):
    return query(request, User.objects.all(), UserSerializer)


def add(data):
    data = User(name=data['name'],
                account=data['account'],
                psw=data['psw'],
                createDateTime=datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    data.save()
    return HttpResponse('success')


def remove(key):
    User.objects.get(id=key).delete()
    return HttpResponse('success')


def update(key, data):
    obj = User.objects.get(id=key)
    obj.name = data['name']
    obj.account = data['account']
    obj.psw = data['psw']
    obj.save()
    return HttpResponse('success')
