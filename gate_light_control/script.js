// ==========================================
// CẤU HÌNH FIREBASE - ĐIỀN THÔNG TIN CỦA BẠN
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyBE1SXwkDGs2-x64ZDu-MkPJ4jp9bxBPaU",
  databaseURL:
    "https://dencongiot-default-rtdb.asia-southeast1.firebasedatabase.app",
};

// Khởi tạo Firebase ngay từ đầu
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let currentPowerState = false;

// ==========================================
// LOGIC XÁC THỰC (ĐĂNG NHẬP / ĐĂNG XUẤT)
// ==========================================

// Kiểm tra phiên đăng nhập khi vừa tải trang
window.onload = function () {
  const savedToken = localStorage.getItem("adminToken");
  if (savedToken) {
    verifyToken(savedToken);
  }
};

// Hàm kích hoạt khi người dùng bấm nút "Đăng Nhập"
function checkPassword() {
  const passInput = document.getElementById("password").value;
  if (!passInput) {
    alert("Vui lòng nhập Token!");
    return;
  }
  verifyToken(passInput);
}

// Đối chiếu token người nhập với admin_token trên Firebase
function verifyToken(tokenToTest) {
  db.ref("/admin_token")
    .once("value")
    .then((snapshot) => {
      const realToken = snapshot.val();

      // Kiểm tra xem token có tồn tại và khớp hay không
      if (realToken !== null && tokenToTest === realToken.toString()) {
        localStorage.setItem("adminToken", tokenToTest);
        showControlScreen();
      } else {
        alert("Sai mã Token! Từ chối truy cập.");
        logout(); // Cẩn thận xoá luôn phiên đăng nhập cũ nếu có
      }
    })
    .catch((error) => {
      console.error("Lỗi lấy dữ liệu: ", error);
      alert("Không thể kết nối máy chủ xác thực.");
    });
}

function logout() {
  localStorage.removeItem("adminToken");
  document.getElementById("password").value = "";
  document.getElementById("login-screen").classList.remove("hidden");
  document.getElementById("control-screen").classList.add("hidden");
}

// ==========================================
// LOGIC ĐIỀU KHIỂN & CẬP NHẬT GIAO DIỆN
// ==========================================

function showControlScreen() {
  document.getElementById("login-screen").classList.add("hidden");
  document.getElementById("control-screen").classList.remove("hidden");

  // Lắng nghe thay đổi trạng thái đèn (Cập nhật Realtime)
  db.ref("/den_cong/powerState").on("value", (snapshot) => {
    currentPowerState = snapshot.val() || false;
    const statusText = document.getElementById("light-status");
    const toggleBtn = document.getElementById("toggle-btn");

    if (currentPowerState) {
      statusText.innerHTML = "<span style='color:green'>ĐANG BẬT</span>";
      toggleBtn.innerText = "TẮT ĐÈN";
      toggleBtn.classList.add("off");
    } else {
      statusText.innerHTML = "<span style='color:red'>ĐANG TẮT</span>";
      toggleBtn.innerText = "BẬT ĐÈN";
      toggleBtn.classList.remove("off");
    }
  });

  // Lắng nghe thay đổi giờ tắt (Cập nhật Realtime)
  db.ref("/den_cong/offTimeMins").on("value", (snapshot) => {
    let mins = snapshot.val();
    if (mins !== null) {
      let h = Math.floor(mins / 60)
        .toString()
        .padStart(2, "0");
      let m = (mins % 60).toString().padStart(2, "0");
      document.getElementById("off-time").value = `${h}:${m}`;
    }
  });
}

function toggleLight() {
  db.ref("/den_cong/webCommand").set(!currentPowerState);
  db.ref("/den_cong/powerState").set(!currentPowerState);
}

function updateOffTime() {
  const timeVal = document.getElementById("off-time").value;
  if (!timeVal) {
    alert("Vui lòng chọn giờ!");
    return;
  }

  const parts = timeVal.split(":");
  const offMins = parseInt(parts[0]) * 60 + parseInt(parts[1]);

  db.ref("/den_cong/offTimeMins")
    .set(offMins)
    .then(() => alert("Đã cập nhật giờ tắt thành công lên Wemos!"));
}
