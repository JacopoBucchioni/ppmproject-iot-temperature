from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import json
from django.core import serializers
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
    print(mis)
    print(sensors)

    return render(request, 'iotemperature/main.html', context={'mis': mis, 'sensor_id': sensors})


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
    sensors = Sensor.objects.all()
    # misurazioni = serializers.serialize("json", Misurazione.objects.filter(sensor__IPAddress='192.168.43.200'))
    misurazioni = serializers.serialize("json", Misurazione.objects.all().order_by('date'))
    print(misurazioni)

    '''
    misurazioni = list(Misurazione.objects.filter(sensor__IPAddress='192.168.43.200'))

    xlabels = []
    temp = []
    hum = []
    for m in misurazioni:
        xlabels.append(m.date.__str__())
        temp.append(m.temperature)
        hum.append(m.humidity)

    print(misurazioni)
    print(xlabels)
    print(temp)
    print(hum)
    '''
    return render(request, 'iotemperature/charts.html', context={'sensors': sensors, 'misurazoni': misurazioni})
