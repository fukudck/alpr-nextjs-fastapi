# stolen_vehicles/forms.py
from django import forms
from .models import StolenVehicle

class StolenVehicleForm(forms.ModelForm):
    class Meta:
        model = StolenVehicle
        fields = ['plate', 'color', 'model', 'reported_date']
        widgets = {
            'reported_date': forms.DateInput(attrs={'type': 'date'}),
        }