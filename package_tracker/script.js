document.addEventListener("DOMContentLoaded", function () {
  // 1. Kiểm tra tham số URL để chuyển đổi sang giao diện xem tùy biến nếu có dữ liệu
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get("name");
  const url = urlParams.get("url");

  if (name && url) {
    document.body.classList.add("custom-tracker-active");
    document.getElementById("track-title").innerText = name;
    document.getElementById("track-frame").src = url;
    document.getElementById("direct-link").href = url;
  }

  // 2. Gán sự kiện nhấn phím Enter cho các ô nhập liệu
  const trackInput = document.getElementById("trackInput");
  const nameInput = document.getElementById("nameInput");

  if (trackInput) {
    trackInput.onkeypress = function (e) {
      if (!e) e = window.event;
      if (e.keyCode == "13") {
        handleTracking();
        return false;
      }
    };
  }
  if (nameInput) {
    nameInput.onkeypress = function (e) {
      if (!e) e = window.event;
      if (e.keyCode == "13") {
        handleTracking();
        return false;
      }
    };
  }
});

function handleTracking() {
  const codeInputEl = document.getElementById("trackInput");
  const nameInputEl = document.getElementById("nameInput");

  if (!codeInputEl) return;

  const codesStr = codeInputEl.value.trim();
  const namesStr = nameInputEl ? nameInputEl.value.trim() : "";

  if (!codesStr) {
    alert("Vui lòng nhập mã!");
    return;
  }

  // Tách chuỗi theo dấu phẩy và loại bỏ khoảng trắng dư thừa
  const codes = codesStr.split(",").map((s) => s.trim());
  const names = namesStr.split(",").map((s) => s.trim());

  const validTrackings = [];

  for (let i = 0; i < codes.length; i++) {
    const code = codes[i].toUpperCase();
    if (!code) continue; // Bỏ qua nếu dòng bị trống do nhập thừa dấu phẩy

    const name = names[i] || ""; // Lấy tên đơn hàng tương ứng hoặc để trống nếu không nhập đủ
    let trackingUrl = "";

    // Xác định đơn vị vận chuyển dựa trên định dạng mã
    if (code.indexOf("SPX") !== -1 || code.indexOf("VN") === 0) {
      trackingUrl = "https://spx.vn/detail/" + code;
    } else if (code.indexOf("G") !== -1 && !/^\d+$/.test(code)) {
      trackingUrl = "https://donhang.ghn.vn/?order_code=" + code;
    } else if (/^\d+$/.test(code)) {
      let promptMsg = `Mã J&T: ${code}`;
      if (name) {
        promptMsg += ` (${name})`;
      }
      const phone = prompt(`${promptMsg}. Nhập 4 số cuối SĐT nhận/gửi:`);
      if (phone) {
        trackingUrl =
          "https://jtexpress.vn/vi/tracking?type=track&billcode=" +
          code +
          "&cellphone=" +
          phone;
      } else {
        continue; // Người dùng hủy nhập SĐT cho đơn J&T này, bỏ qua để tiếp tục đơn khác
      }
    } else if (code.indexOf("VTP") !== -1) {
      trackingUrl = "https://viettelpost.com.vn/tra-cuu-hanh-trinh-don/";
    } else {
      alert(`Định dạng mã "${code}" không thuộc đơn vị hỗ trợ!`);
      continue;
    }

    validTrackings.push({ code, name, url: trackingUrl });
  }

  if (validTrackings.length === 0) return;

  // Nếu tra cứu nhiều đơn hàng cùng lúc, nhắc nhở về cài đặt pop-up của trình duyệt
  if (validTrackings.length > 1) {
    showToast(
      "⚠️ Nếu trình duyệt chặn mở tab mới, hãy nhấp chọn luôn cho phép cửa sổ bật lên (pop-up) từ trang web này.",
    );
  }

  // Tiến hành mở các tab tương ứng
  const baseUrl = window.location.href.split("?")[0];
  validTrackings.forEach((item) => {
    if (item.name) {
      // Nếu có tên đơn hàng: tạo trang xem tùy biến bằng Query Parameters
      const customUrl =
        baseUrl +
        "?name=" +
        encodeURIComponent(item.name) +
        "&url=" +
        encodeURIComponent(item.url);
      window.open(customUrl, "_blank");
    } else {
      // Nếu không có tên đơn hàng: mở trực tiếp liên kết gốc
      window.open(item.url, "_blank");
    }
  });
}

function goBack() {
  // Trở về giao diện tìm kiếm ban đầu bằng cách xóa bỏ tham số trên URL
  window.location.href = window.location.href.split("?")[0];
}

function showToast(msg, duration = 7000) {
  const toast = document.getElementById("toast");
  if (toast) {
    toast.innerText = msg;
    toast.style.display = "block";
    setTimeout(() => {
      toast.style.display = "none";
    }, duration);
  }
}
