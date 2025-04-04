/* Copy text into clipboard */

function copyText_1()
{   
    const name_1 = "Chẳng Thể Lý Giải Nổi Aharen-san Mùa 2";
    navigator.clipboard.writeText(name_1);
    alert("Đã sao chép tên bộ Anime:\n"+ name_1);
    setTimeout(() => {
        close();
        button.disabled = false;
    }, 2700);
}

function copyText_2()
{   
    const name_2 = "Danjo no Yuujou wa Seiritsu suru? (Iya, Shinai!!)";
    navigator.clipboard.writeText(name_2)
    alert("Đã sao chép tên bộ Anime:\n"+ name_2);
    setTimeout(() => {
        close();
        button.disabled = false;
    }, 2700);
}

function copyText_3()
{   
    const name_3 = "Chotto dake Ai ga Omoi Dark Elf ga Isekai kara Oikakete Kita";
    navigator.clipboard.writeText(name_3)
    alert("Đã sao chép tên bộ Anime:\n"+ name_3);
    setTimeout(() => {
        close();
        button.disabled = false;
    }, 2700);
}

function copyText_4()
{   
    const name_4 = "Ballpark de Tsukamaete!";
    navigator.clipboard.writeText(name_4)
    alert("Đã sao chép tên bộ Anime:\n"+ name_4);
    setTimeout(() => {
        close();
        button.disabled = false;
    }, 2700);
}
