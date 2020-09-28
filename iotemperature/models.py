from django.db import models

# Create your models here.


class Cluster(models.Model):
    name = models.CharField(max_length=200, primary_key=True)


class Sensor(models.Model):
    IPAddress = models.GenericIPAddressField(primary_key=True)
    friendlyName = models.CharField(max_length=200, blank=True)
    cluster = models.ForeignKey(Cluster, on_delete=models.SET_NULL, null=True, blank=True)


class Misurazione(models.Model):
    sensor = models.ForeignKey(Sensor, on_delete=models.CASCADE)
    temperature = models.FloatField()
    humidity = models.FloatField()
    date = models.DateTimeField()
