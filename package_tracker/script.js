function handleTracking() {
    let inputEl = document.getElementById('trackInput');
    let code = inputEl.value.trim().toUpperCase();
    
    if (!code) return alert("Vui lòng nhập mã!");

    if (code.indexOf("SPX") !== -1 || code.indexOf("VN") === 0) {
        window.open("https://spx.vn/detail/" + code, '_blank');
    }
    else if (code.indexOf("G") !== -1 && !(/^\d+$/.test(code))) {
        window.open("https://donhang.ghn.vn/?order_code=" + code, '_blank');
    }
    else if (/^\d+$/.test(code)) {
        let phone = prompt("Mã J&T. Nhập 4 số cuối SĐT nhận/gửi:");
        if (phone) {
            window.open("https://jtexpress.vn/vi/tracking?type=track&billcode=" + code + "&cellphone=" + phone, '_blank');
        }
    }
    else if (code.indexOf("VTP") !== -1) {
        window.open("https://viettelpost.com.vn/tra-cuu-hanh-trinh-don/", '_blank');
    }
    else {
        alert("Định dạng mã không thuộc đơn vị hỗ trợ!");
    }
}

document.getElementById('trackInput').onkeypress = function(e) {
    if (!e) e = window.event;
    if (e.keyCode == '13') {
        handleTracking();
        return false;
    }
};