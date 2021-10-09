import json
from django.views.decorators.csrf import csrf_exempt
from datetime import date, datetime
from django.http import HttpResponse
from django.http.response import JsonResponse

from ..models import Goods
from ..models.weight_memo_out import WeightMemoOut
from ..models.truck import Truck
from ..models.steel_plant import SteelPlant
from ..models.intermediary import Intermediary
from app.utils.serializer import WeightMemoOutSerializer
from app.service.service import query
from ..service.camera import catch


@csrf_exempt
def action(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        method = body['method']
        if method == 'post':
            return add(body['data'])
        elif method == 'delete':
            return remove(body['id'])
        elif method == 'update':
            return update(body['id'], body['data'])
    else:
        return find(request)


def find(request):
    return JsonResponse(query(request, WeightMemoOut.objects.all(), WeightMemoOutSerializer), safe=False)


def find_month(request):
    current_month = str(date.today())[0:7]
    res = query(request, WeightMemoOut.objects.all().filter(createDateTime__startswith=current_month),
                WeightMemoOutSerializer)
    return JsonResponse(res, safe=False)


def add(data):
    obj = WeightMemoOut(createDateTime=datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    for key, value in data.items():
        if value:
            if key in ['agreed_prise', 'actual_prise', 'expected_payment', 'opposite_payment', 'advance_payment',
                       'rest_payment',
                       'actual_payment']:
                setattr(obj, key, int(value))
            elif key in ['gross_weight_own', 'gross_weight_opposite', 'body_weight_own', 'body_weight_opposite',
                         'deduct_weight', 'legal_weight_own', 'legal_weight_opposite']:
                setattr(obj, key, float(value))
            elif key == 'truck':
                setattr(obj, key, Truck.objects.get(pk=value))
            elif key == 'goods':
                setattr(obj, key, Goods.objects.get(pk=value))
            elif key == 'steel_plant':
                setattr(obj, key, SteelPlant.objects.get(pk=value))
            elif key == 'intermediary':
                setattr(obj, key, Intermediary.objects.get(pk=value))
            else:
                setattr(obj, key, value)
    if obj.gross_weight_own:
        if obj.gross_weight_opposite:
            if obj.actual_payment:
                setattr(obj, 'status', 'done')
            else:
                setattr(obj, 'status', 'un_pay')
        else:
            # setattr(obj, 'status', 'on_the_way')
            setattr(obj, 'status', 'un_pay')
    else:
        setattr(obj, 'status', 'new')
    obj.save()
    if not obj.gross_weight_own:
        catch(str(obj.id) + '_body', 'memoout')
    return JsonResponse(WeightMemoOutSerializer(instance=obj).data, safe=False)


def remove(key):
    WeightMemoOut.objects.get(id=key).delete()
    return HttpResponse('success')


def update(key, data):
    obj = WeightMemoOut.objects.get(pk=key)
    if (not data['gross_weight_own']) & (str(data['body_weight_own']) != str(obj.body_weight_own)):
        catch(str(obj.id) + '_body', 'memoout')
        # 修改了皮重
    elif data['gross_weight_own']:
        if int(data['body_weight_own']*1000) == int(obj.body_weight_own*1000):
            if str(data['gross_weight_own']) != str(obj.gross_weight_own):
                # 修改毛重
                catch(str(obj.id) + '_gross', 'memoout')
    for key, value in data.items():
        if value:
            if key in ['agreed_prise', 'actual_prise', 'expected_payment', 'opposite_payment', 'advance_payment',
                       'rest_payment',
                       'actual_payment']:
                setattr(obj, key, int(value))
            elif key in ['gross_weight_own', 'gross_weight_opposite', 'body_weight_own', 'body_weight_opposite',
                         'deduct_weight', 'legal_weight_own', 'legal_weight_opposite']:
                setattr(obj, key, float(value))
            elif key == 'truck':
                setattr(obj, key, Truck.objects.get(pk=value))
            elif key == 'goods':
                setattr(obj, key, Goods.objects.get(pk=value))
            elif key == 'steel_plant':
                setattr(obj, key, SteelPlant.objects.get(pk=value))
            elif key == 'intermediary':
                setattr(obj, key, Intermediary.objects.get(pk=value))
            else:
                setattr(obj, key, value)
    if obj.gross_weight_own:
        if obj.gross_weight_opposite:
            if obj.actual_payment:
                setattr(obj, 'status', 'done')
            else:
                setattr(obj, 'status', 'un_pay')
        else:
            # setattr(obj, 'status', 'on_the_way')
            setattr(obj, 'status', 'un_pay')
    else:
        setattr(obj, 'status', 'new')
    obj.save()
    return JsonResponse(WeightMemoOutSerializer(instance=obj).data, safe=False)


def update_opposite(request):
    body = json.loads(request.body)
    obj = WeightMemoOut.objects.get(pk=body['id'])
    for key, value in body['data'].items():
        if value:
            if key in ['actual_prise', 'opposite_payment']:
                setattr(obj, key, int(value))
            elif key in ['gross_weight_opposite', 'body_weight_opposite',
                         'deduct_weight', 'legal_weight_opposite']:
                setattr(obj, key, float(value))
            else:
                setattr(obj, key, value)
    setattr(obj, 'status', 'un_pay')
    setattr(obj, 'arrival_datetime', datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    obj.save()
    return JsonResponse(WeightMemoOutSerializer(instance=obj).data, safe=False)


def update_payment(request):
    body = json.loads(request.body)
    obj = WeightMemoOut.objects.get(pk=body['id'])
    now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    for key, value in body['data'].items():
        if value:
            if key in ['advance_payment', 'rest_payment', 'actual_payment']:
                if key == 'advance_payment' and not (value == obj.advance_payment):
                    setattr(obj, 'advance_payment_datetime', now)
                elif key == 'rest_payment' and not (value == obj.rest_payment):
                    setattr(obj, 'rest_payment_datetime', now)
                setattr(obj, key, int(value))
            else:
                setattr(obj, key, value)
    if obj.payment_done:
        setattr(obj, 'status', 'done')
        setattr(obj, 'complete_datetime', now)
    obj.save()
    return JsonResponse(WeightMemoOutSerializer(instance=obj).data, safe=False)
