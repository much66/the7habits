/**
 * API Handler untuk Survey Worldwhite Enterprise
 * Menghubungkan Form HTML dengan Google Apps Script
 */

// ============================================================================
// PENTING: GANTI URL DI BAWAH INI DENGAN URL DEPLOYMENT GOOGLE SCRIPT ANDA
// ============================================================================
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwwuVOQVokSgGiT2oVRkGKy82lp6iJ1JLvtTXQ5BaDQ/dev'; 

async function saveToGoogleSheet(formData) {
    if (SCRIPT_URL.includes('PASTE_URL') || SCRIPT_URL === '') {
        alert("SETUP ERROR: URL API belum dipasang di file 'api_handler.js'. Data tidak tersimpan.");
        return { result: "error" };
    }

    const btn = document.querySelector('.btn-submit-final');
    if(btn) {
        btn.disabled = true;
        btn.innerText = "Menyimpan Data...";
    }

    try {
        // Menggunakan mode 'no-cors' tidak memungkinkan kita membaca respon JSON
        // Namun, ini cara paling stabil untuk simple form submission tanpa preflight error
        // Kita akan menggunakan 'text/plain' agar tidak memicu CORS Preflight OPTIONS request
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: { "Content-Type": "text/plain" }
        });

        const result = await response.json();

        if(result.status === 'success') {
            console.log("Data tersimpan di baris: " + result.row);
        } else {
            console.error("Gagal simpan:", result);
            alert("Warning: Ada kendala teknis penyimpanan data, namun hasil Anda tetap valid.");
        }
        
        // [FIX] Kembalikan hasil agar bisa dibaca oleh fungsi pemanggil (tombol Test)
        return result;

    } catch (error) {
        console.error("Network Error:", error);
        // Jangan blokir user melihat hasil hanya karena internet lambat
        
        // [FIX] Kembalikan objek error agar pemanggil tahu bahwa ini gagal
        return { status: 'error', message: error.toString() }; 
    } finally {
        if(btn) {
            btn.disabled = false;
            btn.innerText = "Lihat Hasil Penilaian";
        }
    }
}
