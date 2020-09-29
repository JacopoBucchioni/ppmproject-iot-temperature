from django.shortcuts import render
from django.http import HttpResponse
import json
from datetime import datetime
from django.utils import timezone
from .models import Sensor, Cluster, Misurazione

# Create your views here.


def get_sensors(request):
    mis = []
    # sensors = Sensor.objects.all()
    sensors = list(set(Misurazione.objects.values_list('sensor', flat=True)))
    for i in range(len(sensors)):
        mis.append(Misurazione.objects.filter(sensor=sensors[i]).latest('date'))

    return render(request, 'iotemperature/sensors.html', context={'mis': mis})


def post_update(request):
    if request.method == "POST":
        json_data = json.loads(request.body)
        # print(json_data)
        if Sensor.objects.filter(IPAddress=json_data['IPAddress']):
            sensor = Sensor.objects.get(IPAddress=json_data['IPAddress'])
            naive_date = datetime.strptime(json_data['date'], '%Y/%m/%dT%H:%M:%S')
            current_tz = timezone.get_current_timezone()
            date = current_tz.localize(naive_date)
            Misurazione.objects.create(id=None, sensor=sensor, temperature=json_data['temperature'], humidity=json_data['humidity'], date=date)

    return render(request, 'iotemperature/update.html')
