/**
 * API Handler - Production Version
 * Worldwhite Enterprise
 */

// PASTE URL EXEC DI SINI
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyyuZ9tdNFH37V0i1btmLbhT6d-mIFPO3MJNDUN2-XRX7zqsNStmYWEWyTvw8Rul3BAWw/exec'; 

/**
 * MENGAMBIL DAFTAR PERTANYAAN (Wajib ada untuk initSurvey)
 */
async function fetchQuestionsFromSheet() {
    if (!SCRIPT_URL || SCRIPT_URL.includes('/dev')) {
        console.error("URL Configuration Error");
        return [];
    }
    try {
        const response = await fetch(SCRIPT_URL);
        const result = await response.json();
        return result.status === 'success' ? result.data : [];
    } catch (error) {
        console.error("Load Questions Error:", error);
        return [];
    }
}

/**
 * MENYIMPAN DATA (SUBMIT)
 */
async function saveToGoogleSheet(payload) {
    // Tambahkan action type untuk backend
    payload.action = 'submit'; 
    
    // UI Feedback di tombol
    const btn = document.querySelector('.btn-submit-final');
    if(btn) {
        btn.disabled = true;
        btn.innerText = "Sedang Menyimpan...";
    }

    try {
        // Menggunakan mode 'no-cors' untuk kompatibilitas maksimal dengan GitHub Pages
        // Mode ini mengirim data tapi responnya "opaque" (tidak bisa dibaca isinya)
        await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', 
            body: JSON.stringify(payload),
            headers: { "Content-Type": "text/plain" }
        });
        
        // Asumsi sukses (Blind Submit) karena no-cors tidak mengembalikan status
        console.log("Submission sent.");
        return { status: 'success' };

    } catch (error) {
        console.error("Save Error:", error);
        alert("Terjadi gangguan koneksi saat menyimpan data. Cek koneksi internet Anda.");
        return { status: 'error' }; 
    } finally {
        if(btn) {
            btn.disabled = false;
            btn.innerText = "Lihat Hasil Penilaian";
        }
    }
}

/**
 * MENCARI RIWAYAT (HISTORY SUMMARY)
 */
async function fetchUserHistory(email) {
    try {
        const payload = {
            action: 'get_history',
            email: email
        };

        // Menggunakan POST standard (bukan no-cors) agar bisa membaca respon JSON
        // Trik: header text/plain mencegah preflight OPTIONS yang sering gagal di CORS
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { "Content-Type": "text/plain" }
        });
        
        const result = await response.json();
        return result;

    } catch (error) {
        console.error("History Error:", error);
        return { status: 'error', message: "Gagal mengambil data." };
    }
}

/**
 * MENGAMBIL DETAIL JAWABAN PER SUBMISSION (DETAIL VIEW)
 * Fungsi ini BARU ditambahkan untuk fitur detail
 */
async function fetchSubmissionDetails(submissionId) {
    try {
        const payload = {
            action: 'get_submission_details',
            id: submissionId
        };

        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { "Content-Type": "text/plain" }
        });
        
        const result = await response.json();
        return result;

    } catch (error) {
        console.error("Detail Fetch Error:", error);
        return { status: 'error', message: "Gagal mengambil detail." };
    }
}
