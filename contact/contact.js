function contact() {
    const phone_num = "0978042208";
    navigator.clipboard.writeText(phone_num);
    alert("Đã sao chép số điện thoại:\n"+ phone_num);
    window.location.href = 'tel:0978042208';
    setTimeout(() => {
        close();
        button.disabled = false;
    }, 2700);
}