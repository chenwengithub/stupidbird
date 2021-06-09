from django.contrib import admin
from .models.truck import Truck
from .models.weight_memo_in import WeightMemoIn
from .models.weight_memo_out import WeightMemoOut
from .models.steel_plant import SteelPlant
from .models.payment import Payment
from .models.intermediary import Intermediary

admin.site.register(Truck)
admin.site.register(WeightMemoIn)
admin.site.register(WeightMemoOut)
admin.site.register(SteelPlant)
admin.site.register(Payment)
admin.site.register(Intermediary)
