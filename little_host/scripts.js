async function download1() {
    const pdfLink = "https://files.catbox.moe/ye5v2j.pdf";

    try {
        const response = await fetch(pdfLink);
        const blob = await response.blob();

        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = 'Đề cương Công Nghệ.pdf';
        downloadLink.click();
    } catch (error) {
        alert('Không thể tải file PDF. Vui lòng kiểm tra lại link.');
        console.error('Lỗi tải file PDF:', error);
    }
}

async function download2() {
    const pdfLink = "https://files.catbox.moe/x7jyps.pdf";

    try {
        const response = await fetch(pdfLink);
        const blob = await response.blob();

        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = 'Đề cương Tin Học.pdf';
        downloadLink.click();
    } catch (error) {
        alert('Không thể tải file PDF. Vui lòng kiểm tra lại link.');
        console.error('Lỗi tải file PDF:', error);
    }
}

async function download3() {
    const pdfLink = "https://files.catbox.moe/8i1713.pdf";

    try {
        const response = await fetch(pdfLink);
        const blob = await response.blob();

        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = 'Đề cương Lịch Sử.pdf';
        downloadLink.click();
    } catch (error) {
        alert('Không thể tải file PDF. Vui lòng kiểm tra lại link.');
        console.error('Lỗi tải file PDF:', error);
    }
}

async function download4() {
    const pdfLink = "https://files.catbox.moe/myq438.pdf";

    try {
        const response = await fetch(pdfLink);
        const blob = await response.blob();

        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = 'Đề cương Địa Lý.pdf';
        downloadLink.click();
    } catch (error) {
        alert('Không thể tải file PDF. Vui lòng kiểm tra lại link.');
        console.error('Lỗi tải file PDF:', error);
    }
}