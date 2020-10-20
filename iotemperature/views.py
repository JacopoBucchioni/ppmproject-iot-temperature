from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import json
from datetime import datetime
from django.utils import timezone
from .models import Sensor, Cluster, Misurazione

# Create your views here.


def get_mis(request):
    mis = []
    sensors = list(set(Misurazione.objects.values_list('sensor', flat=True)))
    for i in range(len(sensors)):
        mis.append(Misurazione.objects.filter(sensor=sensors[i]).latest('date'))
    mis.sort(key=lambda x: x.date, reverse=True)
    # print(mis)

    return render(request, 'iotemperature/main.html', context={'mis': mis})


def post_update(request):
    if request.method == "POST":
        json_data = json.loads(request.body)
        print(json_data)
        if Sensor.objects.filter(IPAddress=json_data['IPAddress']):
            sensor = Sensor.objects.get(IPAddress=json_data['IPAddress'])
            date = datetime.strptime(json_data['date'], '%Y/%m/%dT%H:%M:%S')
            if date <= datetime.now():  # TODO: to test
                Misurazione.objects.create(id=None, sensor=sensor, temperature=json_data['temperature'], humidity=json_data['humidity'], date=date)

                # return JsonResponse(json_data)
                # return render(request, 'iotemperature/main.html', {'json_data': json_data})

                return HttpResponse('OK Misurazione Registrata')

    return HttpResponse('IPAddress non Registrato')


def sensors_list(request):
    sensors = Sensor.objects.all()
    return render(request, 'iotemperature/sensors.html', context={'sensors': sensors})


def clusters_list(request):
    clusters = Cluster.objects.all()
    return render(request, 'iotemperature/clusters.html', context={'clusters': clusters})


def chart(request):
    misurazioni = Misurazione.objects.all()
    sensors = Sensor.objects.all()
    return render(request, 'iotemperature/charts.html', context={'sensors': sensors, 'misurazoni': misurazioni})
