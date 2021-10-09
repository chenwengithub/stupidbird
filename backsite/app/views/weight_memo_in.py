import json
from django.views.decorators.csrf import csrf_exempt
from datetime import date, datetime
from django.http import HttpResponse
from django.http.response import JsonResponse

from ..models import Goods
from ..models.weight_memo_in import WeightMemoIn
from ..models.payment import Payment
from app.utils.serializer import WeightMemoInSerializer
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
    return JsonResponse(query(request, WeightMemoIn.objects.all(), WeightMemoInSerializer), safe=False)


def find_today(request):
    res = query(request, WeightMemoIn.objects.all().filter(createDateTime__startswith=date.today()),
                WeightMemoInSerializer)
    return JsonResponse(res, safe=False)


def find_current_month(request):
    current_month = str(date.today())[0:7]
    res = query(request, WeightMemoIn.objects.all().filter(createDateTime__startswith=current_month),
                WeightMemoInSerializer)
    return JsonResponse(res, safe=False)


def find_date_range(request):
    date_range = request.GET.get('_date_range').split(',')
    res = query(request, WeightMemoIn.objects.all().filter(createDateTime__range=(date_range[0], date_range[1])),
                WeightMemoInSerializer)
    return JsonResponse(res, safe=False)


def find_month(request):
    month = request.GET.get('_month')
    res = query(request, WeightMemoIn.objects.all().filter(createDateTime__startswith=month),
                WeightMemoInSerializer)
    return JsonResponse(res, safe=False)


def add(data):
    obj = WeightMemoIn(is_done=False)
    payment = Payment(createDateTime=datetime.now().strftime('%Y-%m-%d %H:%M:%S'), remark='')
    for key, value in data.items():
        if value:
            if key in ['gross_weight', 'body_weight', 'deduct_weight', 'actual_payment']:
                setattr(obj, key, int(value))
            elif key == 'legal_prise':
                setattr(obj, key, float(value))
            elif key == 'payment':
                for k, v in data['payment'].items():
                    if v:
                        setattr(payment, k, int(v))
            elif key == 'goods':
                setattr(obj, key, Goods.objects.get(pk=value))
            else:
                setattr(obj, key, value)
    if obj.body_weight:
        legal_weight = obj.gross_weight - obj.body_weight - (obj.deduct_weight or 0)
        account_payable = legal_weight * obj.legal_prise
        setattr(obj, 'legal_weight', legal_weight)
        setattr(obj, 'account_payable', account_payable)
        if obj.actual_payment:
            setattr(obj, 'status', 'done')
            setattr(obj, 'is_done', True)
        else:
            setattr(obj, 'status', 'un_pay')
    else:
        setattr(obj, 'status', 'new')
    if payment.amount_total:
        payment.save()
        obj.payment = payment
    obj.save()
    if not obj.body_weight:
        catch(str(obj.id) + '_gross', 'memoin')
    return JsonResponse(WeightMemoInSerializer(instance=obj).data, safe=False)


def remove(key):
    WeightMemoIn.objects.get(id=key).delete()
    return HttpResponse('success')


def update(key, data):
    obj = WeightMemoIn.objects.get(id=key)
    if (not data['body_weight']) & (str(data['gross_weight']) != str(obj.gross_weight)):
        catch(str(obj.id) + '_gross', 'memoin')
        # 修改了毛重
    elif data['body_weight']:
        if str(data['gross_weight']) == str(obj.gross_weight):
            if str(data['body_weight']) != str(obj.body_weight):
                # 修改皮重
                catch(str(obj.id) + '_body', 'memoin')
    for key, value in data.items():
        if value:
            if key in ['gross_weight', 'body_weight', 'deduct_weight', 'actual_payment']:
                if value:
                    setattr(obj, key, int(value))
            elif key == 'legal_prise':
                if value:
                    setattr(obj, key, float(value))
            elif key == 'goods':
                setattr(obj, key, Goods.objects.get(pk=value))
            elif key == 'payment':
                payment = Payment(createDateTime=datetime.now().strftime('%Y-%m-%d %H:%M:%S'), remark='')
                for k, v in value.items():
                    if v:
                        setattr(payment, k, int(v))
                payment.save()
            else:
                setattr(obj, key, value)
    if obj.body_weight:
        legal_weight = obj.gross_weight - obj.body_weight - (obj.deduct_weight or 0)
        account_payable = legal_weight * obj.legal_prise
        setattr(obj, 'legal_weight', legal_weight)
        setattr(obj, 'account_payable', account_payable)
        if obj.actual_payment:
            if payment.amount_iou:
                setattr(obj, 'status', 'un_pay')
            else:
                setattr(obj, 'status', 'done')
                setattr(obj, 'is_done', True)
            if payment.amount_total:
                obj.payment = payment
    obj.save()
    return JsonResponse(WeightMemoInSerializer(instance=obj).data, safe=False)
