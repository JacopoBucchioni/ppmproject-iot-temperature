from django.urls import path

from . import views


urlpatterns = [
    path('', views.home, name='index'),
    path('home/', views.home, name='home'),
    path('home/sensor/<int:pk>/', views.sensor_view, name='sensor_view'),

    path('sensors/', views.sensors_list, name='sensors_list'),
    path('sensors/edit/<int:pk>/', views.sensor_edit, name='sensor_edit'),

    path('charts/', views.charts, name='charts'),

    # path('cluster/', views.cluster_list, name='cluster'),


    # AJAX
    path('update/', views.post_update, name='update'),
    path('getData/', views.get_data, name='get_data'),
    path('home/getData/', views.get_data, name='get_data'),
    path('home/sensor/<int:pk>/getData/', views.get_sensor_data, name='get_sensor_data'),
    path('charts/sensor/<int:pk>/getData/', views.get_misurazioni, name='get_misurazioni'),
    path('sensors/delete/<int:pk>/', views.delete, name='delete'),
]
