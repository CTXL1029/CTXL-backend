function copy_anime_name() {
    const copy_anime_name = "https://ctxl1029.github.io/CTXL-backend/copy_anime_name";
    navigator.clipboard.writeText(copy_anime_name);
    window.open(copy_anime_name, "_blank");
}

function contact() {
    const phone_num = "0978042208";
    navigator.clipboard.writeText(phone_num);
    alert("Đã sao chép số điện thoại:\n"+ phone_num);
    window.location.href = 'tel:0988123456';
    setTimeout(() => {
        close();
        button.disabled = false;
    }, 2700);
}