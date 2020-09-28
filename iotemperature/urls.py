from django.urls import path

from . import views

urlpatterns = [
    path('', views.get_sensors, name='sensors'),
    path('update/', views.post_update, name='update')
]
