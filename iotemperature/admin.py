from django.contrib import admin
from .models import Sensor, Cluster, Misurazione

# Register your models here.

admin.site.register(Sensor)
admin.site.register(Cluster)
admin.site.register(Misurazione)
