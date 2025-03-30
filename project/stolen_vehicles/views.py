# stolen_vehicles/views.py
from django.shortcuts import render, redirect, get_object_or_404
from .models import StolenVehicle
from .forms import StolenVehicleForm

# ------------------------------------------------------------
# Read - Hiển thị danh sách xe bị đánh cắp
# ------------------------------------------------------------
def vehicle_list(request):
    # Lấy tất cả bản ghi và sắp xếp theo ngày báo cáo giảm dần
    vehicles = StolenVehicle.objects.all().order_by('-reported_date')
    return render(request, 'stolen_vehicles/list.html', {'vehicles': vehicles})

# ------------------------------------------------------------
# Create - Thêm xe mới vào database
# ------------------------------------------------------------
def add_vehicle(request):
    if request.method == 'POST':
        # Xử lý dữ liệu form khi submit
        form = StolenVehicleForm(request.POST)
        if form.is_valid():
            form.save()  # Lưu dữ liệu vào database
            return redirect('vehicle_list')  # Chuyển hướng về trang danh sách
    else:
        # Hiển thị form trống cho GET request
        form = StolenVehicleForm()
    return render(request, 'stolen_vehicles/add.html', {'form': form})

# ------------------------------------------------------------
# Update - Cập nhật thông tin xe
# ------------------------------------------------------------
def edit_vehicle(request, vehicle_id):
    # Tìm xe theo ID, nếu không tồn tại trả về 404
    vehicle = get_object_or_404(StolenVehicle, id=vehicle_id)
    
    if request.method == 'POST':
        # Cập nhật dữ liệu từ form vào instance hiện có
        form = StolenVehicleForm(request.POST, instance=vehicle)
        if form.is_valid():
            form.save()
            return redirect('vehicle_list')
    else:
        # Hiển thị form với dữ liệu hiện tại của xe
        form = StolenVehicleForm(instance=vehicle)
    return render(request, 'stolen_vehicles/edit.html', {'form': form})

# ------------------------------------------------------------
# Delete - Xóa xe khỏi database
# ------------------------------------------------------------
def delete_vehicle(request, vehicle_id):
    # Tìm xe theo ID, nếu không tồn tại trả về 404
    vehicle = get_object_or_404(StolenVehicle, id=vehicle_id)
    vehicle.delete()  # Xóa bản ghi
    return redirect('vehicle_list')  # Chuyển hướng về danh sách