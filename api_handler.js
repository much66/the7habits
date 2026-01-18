const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw2Mgic4rjgvdTnPE9MP0NXEbrdGDlSxx7DzTJuB9sNXBeYRw4lbcl_QRQhe_C4drEiow/exec'; 

async function saveToGoogleSheet(formData) {
    // --- DIAGNOSA VERSI FILE ---
    // Cek Console browser (F12). Jika tidak muncul tulisan ini, berarti browser masih pakai file lama.
    console.log("Versi Script: 2.1 (No-CORS Mode)");

    // Validasi URL
    if (SCRIPT_URL.includes('/dev')) {
        alert("ERROR: URL masih '/dev'. Harap ganti ke '/exec' di file api_handler.js");
        return { status: "error" };
    }

    const btn = document.querySelector('.btn-submit-final');
    // Deteksi apakah ini tombol test atau tombol submit asli
    const isTestBtn = btn && (btn.innerText.includes("Tes") || (document.activeElement && document.activeElement.innerText.includes("Test")));

    if(btn && !isTestBtn) {
        btn.disabled = true;
        btn.innerText = "Menyimpan Data...";
    }

    try {
        // --- MODE NO-CORS (Bypass CORS Github Pages) ---
        // Kita gunakan 'no-cors' agar browser TIDAK mengharapkan balasan JSON (yang bikin error CORS)
        // KONSEKUENSI: Kita tidak tahu apakah data sukses disimpan atau gagal di server.
        await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', 
            body: JSON.stringify(formData),
            headers: { 
                "Content-Type": "text/plain" 
            }
        });

        console.log("Request sent (No-CORS mode) - Mengirim tanpa menunggu balasan");
        
        // Buat fake success karena kita tidak bisa baca respon asli di mode no-cors
        const fakeSuccess = { status: 'success', row: 'Terkirim (Blind Submit)' };
        
        // Notifikasi visual bahwa perintah sudah dikirim
        if(isTestBtn || (document.activeElement && document.activeElement.innerText.includes("Test"))) {
            alert("✅ DATA TERKIRIM (Mode Blind)\n\nBrowser telah mengirim data ke Google.\nKarena batasan keamanan domain kantor, kita tidak bisa memverifikasi balasan server.\n\nSILAKAN CEK MANUAL DI SPREADSHEET.\n(Pastikan tab sheet bernama 'DataSurvey')");
        }

        return fakeSuccess;

    } catch (error) {
        console.error("Network Error:", error);
        alert("Gagal mengirim data. Error: " + error.toString());
        return { status: 'error', message: error.toString() }; 
    } finally {
        if(btn && !isTestBtn) {
            btn.disabled = false;
            btn.innerText = "Lihat Hasil Penilaian";
        }
    }
}
