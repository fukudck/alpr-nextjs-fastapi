# stolen_vehicles/models.py
from django.db import models

class StolenVehicle(models.Model):
    plate = models.CharField(max_length=20, unique=True, verbose_name="Biển số")
    color = models.CharField(max_length=50, verbose_name="Màu xe")
    model = models.CharField(max_length=100, verbose_name="Model xe")
    reported_date = models.DateField(verbose_name="Ngày báo mất")
    created_at = models.DateTimeField(auto_now_add=True)  # Tự động thêm thời gian tạo

    def __str__(self):
        return self.plate