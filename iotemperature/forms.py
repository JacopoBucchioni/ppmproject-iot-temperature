from django import forms

from .models import Sensor, Cluster


class SensorForm(forms.ModelForm):
    class Meta:
        model = Sensor
        # fields = ('friendlyName', 'IPAddress', 'cluster')
        fields = ('friendlyName', 'IPAddress',)

        widgets = {
            'friendlyName': forms.TextInput(attrs={'class': 'form-control'}),
            'IPAddress': forms.TextInput(attrs={'class': 'form-control', 'minlength': '7', 'maxlength': '15', 'size': '15', 'pattern': '^((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$' }),
            'cluster': forms.Select(attrs={'class': 'form-control'})
        }









class ClusterForm(forms.ModelForm):
    class Meta:
        model = Cluster
        fields = ('name',)

        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control'}),
        }
