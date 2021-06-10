from django.urls import path

from .views import views, intermediary, payment, steel_plant, truck, weight_memo_out, weight_memo_in

urlpatterns = [
    path('', views.index, name='index'),
    path('api/steel_plant/', steel_plant.action),
    path('api/truck/', truck.action),
    path('api/intermediary/', intermediary.action),
    path('api/payment/', payment.action),
    path('api/weight_memo_out/', weight_memo_out.action),
    path('api/weight_memo_out/opposite', weight_memo_out.update_opposite),
    path('api/weight_memo_out/payment', weight_memo_out.update_payment),
    path('api/weight_memo_in/', weight_memo_in.action),
    path('api/weight_memo_in/today', weight_memo_in.find_today),
    path('api/weight_memo_in/current_month', weight_memo_in.find_current_month),
    path('api/weight_memo_in/date_range', weight_memo_in.find_date_range),
    path('api/weight_memo_in/month', weight_memo_in.find_month),
]
