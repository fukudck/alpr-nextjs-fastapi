from django.urls import path
from . import views

urlpatterns = [
    path('list/', views.vehicle_list, name='vehicle_list'),  # Đổi tên view
    path('add/', views.add_vehicle, name='add_vehicle'),
    path('edit/<int:vehicle_id>/', views.edit_vehicle, name='edit_vehicle'),  # Đổi tham số
    path('delete/<int:vehicle_id>/', views.delete_vehicle, name='delete_vehicle'),  # Thêm route xóa
]