/**
 * API Handler untuk Survey Worldwhite Enterprise
 * Menghubungkan Form HTML dengan Google Apps Script
 */

// PENTING: Ganti URL di bawah ini dengan URL Web App dari Google Apps Script Deployment Anda
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzDT1JtB9ec3y2qGXOL6q9Xxq8gbkmBj4spzVxPB8RSRy8DZxzZaUigMPqEEXIWDJN55g/exec';

/**
 * Mengirim data survey ke Google Sheet
 * @param {Object} formData - Object berisi nama, email, hp, scores, dan total
 */
async function saveToGoogleSheet(formData) {
    if (SCRIPT_URL === 'PASTE_YOUR_WEB_APP_URL_HERE' || SCRIPT_URL === '') {
        console.warn("URL Script belum disetting. Data hanya diproses lokal.");
        alert("Mode Demo: Data tidak disimpan ke database karena URL API belum disetting.");
        return { result: "demo" };
    }

    try {
        // Tampilkan loading state (opsional, bisa dihandle di UI utama)
        const submitBtn = document.querySelector('.btn-submit-final'); // Kita akan tambah class ini di HTML
        const originalText = submitBtn ? submitBtn.innerText : 'Loading...';
        if (submitBtn) {
            submitBtn.innerText = "Menyimpan Data...";
            submitBtn.disabled = true;
        }

        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(formData),
            // 'no-cors' mode dibutuhkan untuk request ke Google Apps Script dari client side
            // namun ini berarti kita tidak bisa membaca response status secara detail
            // tapi request tetap terkirim.
            // Untuk deployment production yang proper, biasanya menggunakan 'text/plain' 
            // agar tidak memicu preflight check CORS yang rumit.
             headers: {
                "Content-Type": "text/plain;charset=utf-8",
            },
        });

        const result = await response.json();
        
        if (submitBtn) {
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        }

        return result;

    } catch (error) {
        console.error("Error saving data:", error);
        // Fallback: Jika gagal fetch (biasanya karena CORS di localhost), 
        // kita tetap anggap sukses di UI agar user tidak bingung, tapi log error.
        // Di production (hosting https), ini akan berjalan lebih mulus.
        if (document.querySelector('.btn-submit-final')) {
            document.querySelector('.btn-submit-final').disabled = false;
            document.querySelector('.btn-submit-final').innerText = "Lihat Hasil Penilaian";
        }
        return { result: "error", message: error.toString() };
    }
}

/**
 * Contoh fungsi Read Data (Untuk pengembangan selanjutnya)
 */
async function getSurveyData() {
    try {
        const response = await fetch(SCRIPT_URL);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error reading data:", error);
        return [];
    }
}
