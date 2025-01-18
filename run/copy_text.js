/* Copy text into clipboard */

function copyText_1()
{   
    const name_1 = "Đoá Hoa Bách Hợp Ngắn Ngủi";
    navigator.clipboard.writeText(name_1);
    alert("Đã sao chép tên bộ Anime:\n"+ name_1);
    setTimeout(() => {
        close();
        button.disabled = false;
    }, 2700);
}

function copyText_2()
{   
    const name_2 = "Kết Hôn Với Người Mà Tôi Ghét Nhất";
    navigator.clipboard.writeText(name_2)
    alert("Đã sao chép tên bộ Anime:\n"+ name_2);
    setTimeout(() => {
        close();
        button.disabled = false;
    }, 2700);
}

function copyText_3()
{   
    const name_3 = "Dandadan";
    navigator.clipboard.writeText(name_3)
    alert("Đã sao chép tên bộ Anime:\n"+ name_3);
    setTimeout(() => {
        close();
        button.disabled = false;
    }, 2700);
}
