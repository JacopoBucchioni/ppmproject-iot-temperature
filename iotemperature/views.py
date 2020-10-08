from django.shortcuts import render
from django.http import HttpResponse
import json
from datetime import datetime
from django.utils import timezone
from .models import Sensor, Cluster, Misurazione

# Create your views here.


def main_page(request):
    return render(request, 'iotemperature/base.html')


def get_sensors(request):
    mis = []
    sensors = list(set(Misurazione.objects.values_list('sensor', flat=True)))
    for i in range(len(sensors)):
        mis.append(Misurazione.objects.filter(sensor=sensors[i]).latest('date'))
    mis.sort(key=lambda x: x.date, reverse=True)
    # print(mis)

    return render(request, 'iotemperature/sensors.html', context={'mis': mis})


def post_update(request):
    if request.method == "POST":
        json_data = json.loads(request.body)
        print(json_data)
        if Sensor.objects.filter(IPAddress=json_data['IPAddress']):
            sensor = Sensor.objects.get(IPAddress=json_data['IPAddress'])
            date = datetime.strptime(json_data['date'], '%Y/%m/%dT%H:%M:%S')
            if date <= datetime.now():  # todo to test
                Misurazione.objects.create(id=None, sensor=sensor, temperature=json_data['temperature'], humidity=json_data['humidity'], date=date)

    return render(request, 'iotemperature/update.html')

