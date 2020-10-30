from django.db import models

# Create your models here.


class Cluster(models.Model):
    name = models.CharField(max_length=200, blank=False, unique=True)

    def __str__(self):
        return self.name


class Sensor(models.Model):
    friendlyName = models.CharField(max_length=200, blank=True, verbose_name="Nome")
    IPAddress = models.GenericIPAddressField(blank=False, unique=True, verbose_name="Indirizzo IP")
    cluster = models.ForeignKey(Cluster, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        if self.friendlyName:
            return self.friendlyName
        else:
            return self.IPAddress

    class Meta:
        verbose_name = "Sensore"
        verbose_name_plural = "Sensori"


class Misurazione(models.Model):
    sensor = models.ForeignKey(Sensor, on_delete=models.CASCADE)
    temperature = models.FloatField()
    humidity = models.FloatField()
    date = models.DateTimeField()

    def __str__(self):
        return self.sensor.__str__()+"__"+self.date.__str__()

    class Meta:
        verbose_name = "misurazione"
        verbose_name_plural = "misurazioni"
