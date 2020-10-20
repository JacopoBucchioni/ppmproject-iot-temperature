from django.urls import path

from . import views


urlpatterns = [
    path('', views.get_mis, name='misurazioni'),
    path('update/', views.post_update, name='update'),
    path('chart/', views.chart, name='chart'),
    path('sensors/', views.sensors_list, name='sensors'),
    path('clusters/', views.clusters_list, name='clusters'),
]
