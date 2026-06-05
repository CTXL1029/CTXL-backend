// ==========================================
// CẤU HÌNH FIREBASE
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyBE1SXwkDGs2-x64ZDu-MkPJ4jp9bxBPaU",
  databaseURL:
    "https://dencongiot-default-rtdb.asia-southeast1.firebasedatabase.app",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();

let currentPowerState = false;

// Tự động kiểm tra phiên đăng nhập an toàn cũ
auth.onAuthStateChanged((user) => {
  if (user) {
    document.getElementById("loading-screen").classList.add("hidden");
    document.getElementById("control-screen").classList.remove("hidden");
    startRealtimeSync();
  } else {
    askForAdminToken();
  }
});

function askForAdminToken() {
  const tokenInput = prompt(
    "🔐 XÁC THỰC HỆ THỐNG\nVui lòng nhập admin_token để kích hoạt quyền điều khiển:",
  );
  if (tokenInput === null) {
    alert("Bạn buộc phải cung cấp token bảo mật để truy cập hệ thống!");
    askForAdminToken();
    return;
  }
  verifyToken(tokenInput);
}

function verifyToken(tokenToTest) {
  db.ref("/admin_token")
    .once("value")
    .then((snapshot) => {
      const serverToken = snapshot.val();
      if (tokenToTest === serverToken) {
        // Sử dụng phương thức ẩn danh để vượt qua Rules của Firebase an toàn
        auth
          .signInAnonymously()
          .then(() => {
            document.getElementById("loading-screen").classList.add("hidden");
            document
              .getElementById("control-screen")
              .classList.remove("hidden");
            startRealtimeSync();
          })
          .catch((err) => {
            alert("Lỗi xác thực Firebase: " + err.message);
            window.location.reload();
          });
      } else {
        alert("❌ Token không chính xác! Quyền truy cập bị từ chối.");
        askForAdminToken();
      }
    })
    .catch((err) => {
      alert("Không thể kết nối đến máy chủ bảo mật: " + err.message);
    });
}

function startRealtimeSync() {
  // Lắng nghe trạng thái nguồn THỰC TẾ phản hồi từ Wemos
  db.ref("/den_cong/powerState").on("value", (snapshot) => {
    currentPowerState = snapshot.val() || false;
    const statusBox = document.getElementById("status-box");
    const toggleBtn = document.querySelector(".btn-toggle");

    if (currentPowerState) {
      statusBox.innerText = "☀️ ĐÈN ĐANG BẬT";
      statusBox.className = "status on";
    } else {
      statusBox.innerText = "🌙 ĐÈN ĐANG TẮT";
      statusBox.className = "status off";
    }
  });

  // Đồng bộ Giờ BẬT tự động từ hệ thống hoàng hôn lên màn hình
  db.ref("/den_cong/onTimeMins").on("value", (snapshot) => {
    let mins = snapshot.val();
    if (mins != null) {
      document.getElementById("onTime").value = minutesToTimeString(mins);
    }
  });

  // Đồng bộ Giờ TẮT tự động từ cơ sở dữ liệu lên màn hình
  db.ref("/den_cong/offTimeMins").on("value", (snapshot) => {
    let mins = snapshot.val();
    if (mins != null) {
      document.getElementById("offTime").value = minutesToTimeString(mins);
    }
  });
}

function minutesToTimeString(mins) {
  let h = Math.floor(mins / 60)
    .toString()
    .padStart(2, "0");
  let m = (mins % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

function timeStringToMinutes(timeStr) {
  const parts = timeStr.split(":");
  return parseInt(parts[0]) * 60 + parseInt(parts[1]);
}

// Hàm gửi duy nhất một lệnh điều khiển trung gian, không tự ý ghi đè powerState
function toggleLight() {
  const nextState = !currentPowerState;
  db.ref("/den_cong/webCommand")
    .set(nextState)
    .catch((error) => {
      alert("Lỗi gửi lệnh điều khiển: " + error.message);
    });
}

function saveSettings() {
  const onTimeVal = document.getElementById("onTime").value;
  const offTimeVal = document.getElementById("offTime").value;

  if (!onTimeVal || !offTimeVal) {
    alert("Vui lòng nhập đầy đủ cả Giờ BẬT và Giờ TẮT!");
    return;
  }

  const onMins = timeStringToMinutes(onTimeVal);
  const offMins = timeStringToMinutes(offTimeVal);

  // Cập nhật các mốc thời gian cấu hình lên Firebase
  Promise.all([
    db.ref("/den_cong/onTimeMins").set(onMins),
    db.ref("/den_cong/offTimeMins").set(offMins),
  ])
    .then(() => {
      alert("🎉 Đã lưu cấu hình lịch trình bật/tắt thành công!");
    })
    .catch((error) => {
      alert("Lỗi lưu cấu hình: " + error.message);
    });
}
