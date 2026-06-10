document.addEventListener("DOMContentLoaded", () => {
  // === LOGIC THAY ĐỔI GIAO DIỆN (LIGHT / DARK / SYSTEM) ===
  const themeBtn = document.getElementById("theme-btn");
  const themeMenu = document.getElementById("theme-menu");
  const themeIcon = document.getElementById("theme-icon");
  const themeText = document.getElementById("theme-text");

  themeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    themeMenu.classList.toggle("hidden");
  });

  document.addEventListener("click", () => {
    themeMenu.classList.add("hidden");
  });

  function applyTheme(theme) {
    const root = document.documentElement;
    themeIcon.className = "fa-solid";

    if (theme === "dark") {
      root.classList.add("dark");
      themeIcon.classList.add("fa-moon", "text-indigo-400");
      if (themeText) themeText.innerText = "Giao diện tối";
      localStorage.setItem("theme", "dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
      themeIcon.classList.add("fa-sun", "text-amber-500");
      if (themeText) themeText.innerText = "Giao diện sáng";
      localStorage.setItem("theme", "light");
    } else {
      localStorage.setItem("theme", "system");
      if (themeText) themeText.innerText = "Theo thiết bị";
      themeIcon.classList.add("fa-circle-half-stroke", "text-slate-500");

      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }

  themeMenu.querySelectorAll("[data-theme]").forEach((btn) => {
    btn.addEventListener("click", () => {
      applyTheme(btn.getAttribute("data-theme"));
    });
  });

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      if (
        localStorage.getItem("theme") === "system" ||
        !localStorage.getItem("theme")
      ) {
        if (e.matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    });

  const savedTheme = localStorage.getItem("theme") || "system";
  applyTheme(savedTheme);

  // === KHU VỰC XỬ LÝ BIỂU MẪU & TÍNH TOÁN KẾT QUẢ TRUNG BÌNH ===
  const btnCalculate = document.getElementById("btn-calculate");
  const btnClear = document.getElementById("btn-clear");
  const resultsContainer = document.getElementById("results-container");
  const errorModal = document.getElementById("error-modal");
  const errorList = document.getElementById("error-list");
  const btnCloseError = document.getElementById("btn-close-error");

  const avgSysTxt = document.getElementById("avg-sys");
  const avgDiaTxt = document.getElementById("avg-dia");
  const avgPulseTxt = document.getElementById("avg-pulse");
  const statusText = document.getElementById("status-text");

  const inputMappings = [
    { d: "sys-1", m: "sys-1-m" },
    { d: "dia-1", m: "dia-1-m" },
    { d: "pulse-1", m: "pulse-1-m" },
    { d: "sys-2", m: "sys-2-m" },
    { d: "dia-2", m: "dia-2-m" },
    { d: "pulse-2", m: "pulse-2-m" },
    { d: "sys-3", m: "sys-3-m" },
    { d: "dia-3", m: "dia-3-m" },
    { d: "pulse-3", m: "pulse-3-m" },
  ];

  inputMappings.forEach((mapping) => {
    const desktopInput = document.getElementById(mapping.d);
    const mobileInput = document.getElementById(mapping.m);

    desktopInput.addEventListener("input", (e) => {
      mobileInput.value = e.target.value;
    });
    mobileInput.addEventListener("input", (e) => {
      desktopInput.value = e.target.value;
    });
  });

  function toggleErrorModal(show) {
    if (show) {
      errorModal.classList.remove("hidden");
      setTimeout(() => {
        errorModal.firstElementChild.classList.remove("scale-95");
        errorModal.firstElementChild.classList.add("scale-100");
      }, 10);
    } else {
      errorModal.firstElementChild.classList.remove("scale-100");
      errorModal.firstElementChild.classList.add("scale-95");
      setTimeout(() => {
        errorModal.classList.add("hidden");
      }, 150);
    }
  }

  function validateField(val, fieldName, rowTitle) {
    const trimmed = val.trim();
    if (trimmed === "") {
      return `${rowTitle} - <strong>${fieldName}</strong> chưa được điền.`;
    }
    const digitsOnlyRegex = /^\d+$/;
    if (!digitsOnlyRegex.test(trimmed)) {
      return `${rowTitle} - <strong>${fieldName}</strong> có chứa ký tự lạ không hợp lệ.`;
    }
    if (Number(trimmed) <= 0) {
      return `${rowTitle} - <strong>${fieldName}</strong> phải lớn hơn 0.`;
    }
    return null;
  }

  btnCalculate.addEventListener("click", () => {
    const sys1 = document.getElementById("sys-1").value;
    const dia1 = document.getElementById("dia-1").value;
    const pulse1 = document.getElementById("pulse-1").value;
    const sys2 = document.getElementById("sys-2").value;
    const dia2 = document.getElementById("dia-2").value;
    const pulse2 = document.getElementById("pulse-2").value;
    const sys3 = document.getElementById("sys-3").value;
    const dia3 = document.getElementById("dia-3").value;
    const pulse3 = document.getElementById("pulse-3").value;

    let errors = [];
    let err;

    if ((err = validateField(sys1, "Tâm thu (SYS)", "Lần thứ 1")))
      errors.push(err);
    if ((err = validateField(dia1, "Tâm trương (DIA)", "Lần thứ 1")))
      errors.push(err);
    if ((err = validateField(pulse1, "Nhịp tim", "Lần thứ 1")))
      errors.push(err);

    if ((err = validateField(sys2, "Tâm thu (SYS)", "Lần thứ 2")))
      errors.push(err);
    if ((err = validateField(dia2, "Tâm trương (DIA)", "Lần thứ 2")))
      errors.push(err);
    if ((err = validateField(pulse2, "Nhịp tim", "Lần thứ 2")))
      errors.push(err);

    if ((err = validateField(sys3, "Tâm thu (SYS)", "Lần thứ 3")))
      errors.push(err);
    if ((err = validateField(dia3, "Tâm trương (DIA)", "Lần thứ 3")))
      errors.push(err);
    if ((err = validateField(pulse3, "Nhịp tim", "Lần thứ 3")))
      errors.push(err);

    if (errors.length > 0) {
      resultsContainer.classList.add("hidden");
      errorList.innerHTML = "";
      errors.forEach((item) => {
        const li = document.createElement("li");
        li.className =
          "flex items-start space-x-2 text-slate-700 dark:text-slate-300 bg-rose-50/50 dark:bg-rose-950/20 p-2.5 rounded-xl border border-rose-100 dark:border-rose-900/30 text-xs md:text-sm animate-pulse";
        li.innerHTML = `<i class="fa-solid fa-circle-exclamation text-rose-500 mt-0.5"></i> <span>${item}</span>`;
        errorList.appendChild(li);
      });
      toggleErrorModal(true);
      return;
    }

    const avgSys =
      (Number(sys1.trim()) + Number(sys2.trim()) + Number(sys3.trim())) / 3;
    const avgDia =
      (Number(dia1.trim()) + Number(dia2.trim()) + Number(dia3.trim())) / 3;
    const avgPulse =
      (Number(pulse1.trim()) + Number(pulse2.trim()) + Number(pulse3.trim())) /
      3;

    avgSysTxt.innerText = avgSys.toFixed(1);
    avgDiaTxt.innerText = avgDia.toFixed(1);
    avgPulseTxt.innerText = avgPulse.toFixed(1);

    let healthEvaluation = "";
    if (avgSys < 120 && avgDia < 80) {
      healthEvaluation =
        "Huyết áp trung bình ở mức <strong>Bình thường</strong>. Đây là trạng thái lý tưởng, hãy duy trì lối sống lành mạnh này!";
    } else if (avgSys >= 120 && avgSys <= 129 && avgDia < 80) {
      healthEvaluation =
        "Chỉ số báo hiệu mức <strong>Tiền tăng huyết áp</strong>. Nên hạn chế muối trong khẩu phần ăn và tăng cường vận động cơ thể.";
    } else if (
      (avgSys >= 130 && avgSys <= 139) ||
      (avgDia >= 80 && avgDia <= 89)
    ) {
      healthEvaluation =
        "Chỉ số thuộc nhóm <strong>Tăng huyết áp Giai đoạn 1</strong>. Hãy đo đạc định kỳ đều đặn hơn và tham khảo thêm lời khuyên của bác sĩ.";
    } else if (avgSys >= 140 || avgDia >= 90) {
      healthEvaluation =
        "⚠️ Chỉ số thuộc mức <strong>Tăng huyết áp Giai đoạn 2</strong>. Bạn cần tới các cơ sở y tế chuyên khoa thăm khám trực tiếp để có hướng xử trí an toàn nhất.";
    } else {
      healthEvaluation =
        "Chỉ số huyết áp ở mức ổn định. Tiếp tục duy trì theo dõi chu kỳ sức khỏe.";
    }

    statusText.innerHTML = healthEvaluation;
    resultsContainer.classList.remove("hidden");
    resultsContainer.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  btnCloseError.addEventListener("click", () => {
    toggleErrorModal(false);
  });
  errorModal.addEventListener("click", (e) => {
    if (e.target === errorModal) toggleErrorModal(false);
  });

  btnClear.addEventListener("click", () => {
    document
      .querySelectorAll('input[type="text"]')
      .forEach((input) => (input.value = ""));
    resultsContainer.classList.add("hidden");
  });
});
