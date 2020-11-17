from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest
from django.shortcuts import get_object_or_404
import json
from django.core import serializers
from datetime import datetime
from django.forms.models import model_to_dict
from .models import Sensor, Cluster, Misurazione
from .forms import SensorForm, ClusterForm

from timeit import default_timer as timer

# Create your views here.

online = {}


def is_offline(pk: int = 0):  # se la data dell'ultima misurazione salvata in online è più vecchia di offlineInterval rispetto all'ora corrente il sensore che viene considerato offline e messo a None
    offlineInterval = 30  # in seconds
    if pk:
        if online['sensor_' + str(pk)]:
            if abs((datetime.now() - online['sensor_' + str(pk)]['date'])).seconds > offlineInterval:
                online['sensor_' + str(pk)] = None
    else:
        for i in online:
            if online[str(i)]:
                if abs((datetime.now() - online[str(i)]['date'])).seconds > offlineInterval:
                    online[str(i)] = None


def home(request):
    return render(request, 'iotemperature/home.html')


def get_data(request):
    if request.is_ajax():
        # print(online)
        if online:
            is_offline()
            return JsonResponse(online, safe=False)

    return HttpResponse()


def sensor_view(request, pk):
    sensor = get_object_or_404(Sensor, pk=pk)
    return render(request, 'iotemperature/sensor_data.html', context={'sensor': sensor})


def get_sensor_data(request, pk):
    if request.is_ajax():
        if ('sensor_' + str(pk)) in online:
            is_offline(pk)
            return JsonResponse(online['sensor_' + str(pk)], safe=False)

    return HttpResponse()


def post_update(request):
    if request.method == "POST":
        json_data = json.loads(request.body)
        print(json_data)
        if Sensor.objects.filter(IPAddress=json_data['IPAddress']):
            sensor = Sensor.objects.get(IPAddress=json_data['IPAddress'])
            sensor_dict = model_to_dict(sensor, fields=['id', 'friendlyName', 'cluster'])
            # print(sensor_dict)
            date = datetime.strptime(json_data['date'], '%Y-%m-%dT%H:%M:%S')

            if abs((datetime.now() - date)).seconds < 30:
                # sono accettate solo le misurazione la cui ora ha un delta < tot secondi rispetta all'ora corente

                Misurazione.objects.create(id=None, sensor=sensor, temperature=json_data['temperature'], humidity=json_data['humidity'], date=date)
                json_data['sensor'] = sensor_dict
                json_data['date'] = date
                online['sensor_' + str(sensor.id)] = json_data
                # print(json_data)
                # print(online)
                return HttpResponse('OK Misurazione Registrata')

            else:
                return HttpResponse('Data Misurazione superiore alla data corrente')

        else:
            return HttpResponse('Indirizzo IP non Registrato')

    return HttpResponse()


def sensors_list(request):
    sensors = Sensor.objects.all().order_by('-pk')
    form = SensorForm()

    if request.method == 'POST':
        form = SensorForm(request.POST)
        json_response = {}
        if form.is_valid():
            sensor = form.save()

            json_response['sensor_id'] = sensor.pk
            json_response['IPAddress'] = sensor.IPAddress
            json_response['friendlyName'] = sensor.friendlyName
            json_response['cluster'] = sensor.cluster

            return JsonResponse(json_response)

        else:
            return HttpResponse()

    return render(request, 'iotemperature/sensors_list.html', context={'sensors': sensors, 'form': form})


def sensor_edit(request, pk):
    sensor = get_object_or_404(Sensor, pk=pk)
    if request.method == "POST":
        sensor_form = SensorForm(request.POST, instance=sensor)
        if sensor_form.is_valid():
            sensor_form.save()
            return redirect('sensors_list')
    else:
        sensor_form = SensorForm(instance=sensor)

    return render(request, 'iotemperature/sensor_edit.html', context={'form': sensor_form})


def delete(request, pk):
    if request.is_ajax():
        if request.method == "POST":
            sensor = Sensor.objects.get(pk=pk)
            sensor.delete()
            return JsonResponse({'result': 'deleted'})
    return HttpResponse()


def charts(request):
    sensors = Sensor.objects.all()
    return render(request, 'iotemperature/charts.html', context={'sensors': sensors})


def get_misurazioni(request, pk):
    if request.is_ajax():
        start = timer()
        misurazioni = serializers.serialize("json", Misurazione.objects.filter(sensor=pk).order_by('date'))
        end = timer()
        print("time: " + str(end-start))
        # print(misurazioni)
        return JsonResponse(misurazioni, safe=False)

    return HttpResponse()














'''
def get_mis(request):  # ritorna l'ultima misurazione salvata nel DB (se esite) per ogni sensore registrato
    mis = []
    sensors_pk = list(set(Misurazione.objects.values_list('sensor', flat=True)))
    for i in range(len(sensors_pk)):
        m = Misurazione.objects.filter(sensor=sensors_pk[i]).latest('date')
        mis.append(m)
    mis.sort(key=lambda x: x.date, reverse=True)

    #print(sensors_pk)

    return render(request, 'iotemperature/main.html', context={'mis': mis, 'sensors': sensors_pk})


def clusters_list(request):
    clusters = Cluster.objects.all()
    return render(request, 'iotemperature/clusters.html', context={'clusters': clusters})
'''
