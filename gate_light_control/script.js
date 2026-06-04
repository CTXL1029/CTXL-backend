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

// Tự động kiểm tra trạng thái bảo mật của phiên truy cập cũ
auth.onAuthStateChanged((user) => {
  if (user) {
    // Nếu thiết bị/trình duyệt này đã xác thực thành công trước đó -> Vào thẳng giao diện điều khiển
    document.getElementById("loading-screen").classList.add("hidden");
    document.getElementById("control-screen").classList.remove("hidden");
    startRealtimeSync();
  } else {
    // Nếu là thiết bị hoàn toàn mới -> Bắt buộc kích hoạt hộp thoại hệ duyệt
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

  if (!tokenInput.trim()) {
    alert("Token không được để trống!");
    askForAdminToken();
    return;
  }

  // Đăng nhập gián tiếp vào Firebase Auth thông qua mật khẩu người dùng nhập
  auth
    .signInWithEmailAndPassword("admin@ctxl.com", tokenInput.trim())
    .catch((error) => {
      alert("❌ Mã admin_token không chính xác! Quyền truy cập bị từ chối.");
      askForAdminToken();
    });
}

function logout() {
  auth.signOut().then(() => {
    document.getElementById("control-screen").classList.add("hidden");
    document.getElementById("loading-screen").classList.remove("hidden");
  });
}

// ==========================================
// ĐỒNG BỘ DỮ LIỆU ĐIỀU KHIỂN REALTIME
// ==========================================
function startRealtimeSync() {
  // 1. Lắng nghe cập nhật trạng thái BẬT/TẮT đèn realtime
  db.ref("/den_cong/powerState").on("value", (snapshot) => {
    currentPowerState = snapshot.val() || false;
    const statusBox = document.getElementById("status-box");

    if (currentPowerState) {
      statusBox.innerText = "💡 ĐÈN ĐANG BẬT";
      statusBox.className = "status on";
    } else {
      statusBox.innerText = "🌙 ĐÈN ĐANG TẮT";
      statusBox.className = "status off";
    }
  });

  // 2. Lắng nghe cấu hình cập nhật Giờ BẬT tự động từ thiết bị
  db.ref("/den_cong/onTimeMins").on("value", (snapshot) => {
    let mins = snapshot.val();
    if (mins != null) {
      document.getElementById("onTime").value = minutesToTimeString(mins);
    }
  });

  // 3. Lắng nghe cấu hình cập nhật Giờ TẮT tự động
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

function toggleLight() {
  const nextState = !currentPowerState;
  db.ref("/den_cong/webCommand").set(nextState);
  db.ref("/den_cong/powerState").set(nextState);
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

  // Lưu đồng bộ đồng thời lên Firebase đám mây
  Promise.all([
    db.ref("/den_cong/onTimeMins").set(onMins),
    db.ref("/den_cong/offTimeMins").set(offMins),
    db.ref("/den_cong/bootCheckDone").set(false), // Yêu cầu Wemos tính toán kiểm tra lại khung giờ ngay lập tức
  ])
    .then(() => alert("🎉 Đã lưu cấu hình hẹn giờ thành công lên đám mây!"))
    .catch((err) => alert("Lỗi ghi dữ liệu: " + err.message));
}
