from django.contrib import admin
from torkapp.models import TorqueData,TorqueStaticData

# Register your models here.
admin.site.register(TorqueStaticData)
admin.site.register(TorqueData)
