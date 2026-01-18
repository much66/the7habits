/**
 * API Handler untuk Survey Worldwhite Enterprise
 * Menghubungkan Form HTML dengan Google Apps Script
 */

// ============================================================================
// PENTING: GANTI URL DI BAWAH INI DENGAN URL WEB APP ANDA
// URL harus berakhiran '/exec'
// ============================================================================
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzDT1JtB9ec3y2qGXOL6q9Xxq8gbkmBj4spzVxPB8RSRy8DZxzZaUigMPqEEXIWDJN55g/exec'; 


/**
 * Mengirim data survey ke Google Sheet
 * @param {Object} formData - Object berisi nama, email, hp, scores, dan total
 */
async function saveToGoogleSheet(formData) {
    // 1. Validasi URL
    if (SCRIPT_URL.includes('PASTE_YOUR_WEB_APP_URL') || SCRIPT_URL === '') {
        alert("GAGAL MENYIMPAN: URL Web App belum disetting di file api_handler.js.\n\nSilakan buka file api_handler.js dan paste URL dari Google Apps Script.");
        return { result: "error", message: "URL not set" };
    }

    try {
        // Tampilkan loading state
        const submitBtn = document.querySelector('.btn-submit-final'); 
        const originalText = submitBtn ? submitBtn.innerText : 'Loading...';
        
        if (submitBtn) {
            submitBtn.innerText = "Sedang Menyimpan...";
            submitBtn.disabled = true;
            submitBtn.style.backgroundColor = "#7f8c8d";
        }

        // 2. Kirim Data
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            },
        });

        const result = await response.json();
        
        // Kembalikan tombol ke status semula
        if (submitBtn) {
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
            submitBtn.style.backgroundColor = ""; // Reset warna
        }

        // 3. Cek Hasil dari Google Script
        if (result.result === 'success') {
            console.log("Sukses tersimpan di baris:", result.row);
            // Opsional: Tampilkan pesan sukses kecil jika perlu
            // alert("Data berhasil disimpan ke database!"); 
        } else {
            console.error("Script Error:", result);
            alert("PERINGATAN: Terjadi kesalahan saat menyimpan data ke Spreadsheet.\nError: " + JSON.stringify(result));
        }

        return result;

    } catch (error) {
        // 4. Error Handling Jaringan/CORS
        console.error("Network/CORS Error:", error);
        
        if (document.querySelector('.btn-submit-final')) {
            const btn = document.querySelector('.btn-submit-final');
            btn.disabled = false;
            btn.innerText = "Lihat Hasil Penilaian";
            btn.style.backgroundColor = "";
        }

        // Pesan khusus jika membuka file langsung (file://)
        if (window.location.protocol === 'file:') {
            alert("GAGAL MENYIMPAN (Protocol Error):\n\nAnda membuka file ini langsung dari folder (file://). Beberapa browser memblokir koneksi ke Google Script dari file lokal demi keamanan.\n\nSolusi:\n1. Upload file ke GitHub Pages (Recommended)\n2. Atau gunakan Local Server (Live Server VS Code).");
        } else {
            alert("GAGAL MENYIMPAN (Network Error):\n\nKemungkinan penyebab:\n1. Koneksi internet terputus.\n2. URL Script salah.\n3. Deployment script belum diset ke 'Anyone'.");
        }
        
        return { result: "error", message: error.toString() };
    }
}
