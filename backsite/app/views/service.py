from django.db.models import Q
from django.http.response import JsonResponse

import json


def query(req, res, serializer):
    current = int(req.GET.get('current') or 1)
    size = int(req.GET.get('pageSize') or 5)
    total = len(res)
    order = False
    if req.GET.get('sorter'):
        for key, value in json.loads(req.GET.get('sorter')).items():
            if value == 'descend':
                order = '-' + key
            else:
                order = key
    q = Q()
    _q = Q()
    if req.GET.get('filter'):
        for key, value in json.loads(req.GET.get('filter')).items():
            q.children.append((key, value))
    for key, value in req.GET.items():
        if key not in ['current', 'pageSize', 'sorter', 'filter']:
            if value[0: 1] == '~':
                _q.children.append((key, value.replace('~', '')))
            else:
                q.children.append((key, value))

    print(q, _q)
    res = res.filter(q & ~_q)
    if order:
        res = res.order_by(order)
    res = res[(current - 1) * size:current * size]
    res = serializer(instance=res, many=True).data
    response = {
        'current': current,
        'pageSize': size,
        'total': total,
        'data': res
    }
    return JsonResponse(response, safe=False)
