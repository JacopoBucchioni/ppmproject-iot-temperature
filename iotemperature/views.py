from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect, Http404
from django.shortcuts import get_object_or_404
import json
from django.core import serializers
from datetime import datetime
from django.utils import timezone
from django.forms.models import model_to_dict
from .models import Sensor, Cluster, Misurazione
from .forms import SensorForm, ClusterForm

# Create your views here.

online = {}


def home(request):
    return render(request, 'iotemperature/home.html')


def get_mis(request):  # ritorna l'ultima misurazione salvata nel DB (se esite) per ogni sensore registrato
    mis = []
    sensors_pk = list(set(Misurazione.objects.values_list('sensor', flat=True)))
    for i in range(len(sensors_pk)):
        m = Misurazione.objects.filter(sensor=sensors_pk[i]).latest('date')
        mis.append(m)
    mis.sort(key=lambda x: x.date, reverse=True)

    #print(sensors_pk)

    return render(request, 'iotemperature/main.html', context={'mis': mis, 'sensors': sensors_pk})


def sensor_view(request, pk):
    sensor = get_object_or_404(Sensor, pk=pk)
    return render(request, 'iotemperature/sensor_data.html', context={'sensor': sensor})


def get_data(request):
    if request.is_ajax():
        # print(online)
        if online == {}:
            return HttpResponse()
        else:
            return JsonResponse(online)


def get_sensor_data(request, pk):
    if request.is_ajax():
        if ('sensor_' + str(pk)) in online:
            return JsonResponse(online['sensor_' + str(pk)])
        else:
            return HttpResponse()


def post_update(request):
    if request.method == "POST":
        json_data = json.loads(request.body)
        # print(json_data)
        if Sensor.objects.filter(IPAddress=json_data['IPAddress']):
            sensor = Sensor.objects.get(IPAddress=json_data['IPAddress'])
            sensor_dict = model_to_dict(sensor, fields=['id', 'friendlyName', 'cluster'])
            # print(sensor_dict)
            date = datetime.strptime(json_data['date'], '%Y/%m/%dT%H:%M:%S')
            if date <= datetime.now():  # TODO: to test
                Misurazione.objects.create(id=None, sensor=sensor, temperature=json_data['temperature'], humidity=json_data['humidity'], date=date)
                json_data['sensor'] = sensor_dict
                json_data['date_datetime'] = date
                online['sensor_'+str(sensor.id)] = json_data
                print('json_data:')
                print(json_data)
                print()
                print('online:')
                print(online)
                return HttpResponse('OK Misurazione Registrata')

            else:
                return HttpResponse('Data Misurazione superiore alla data corrente')

        else:
            return HttpResponse('Indirizzo IP non Registrato')
















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
            sensor = sensor_form.save()
            return redirect('sensors_list')

    else:
        sensor_form = SensorForm(instance=sensor)

    return render(request, 'iotemperature/sensor_edit.html', context={'form': sensor_form})






def charts(request):
    sensors = Sensor.objects.all()
    misurazioni = serializers.serialize("json", Misurazione.objects.all().order_by('date'))
    # print(misurazioni)
    if request.is_ajax():
        return JsonResponse(misurazioni, safe=False)

    return render(request, 'iotemperature/charts.html', context={'sensors': sensors, 'misurazoni': misurazioni})


def clusters_list(request):
    clusters = Cluster.objects.all()
    return render(request, 'iotemperature/clusters.html', context={'clusters': clusters})
