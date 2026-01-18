/**
 * API Handler - Production Version
 * Worldwhite Enterprise
 */

// PASTE URL EXEC DI SINI
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyyuZ9tdNFH37V0i1btmLbhT6d-mIFPO3MJNDUN2-XRX7zqsNStmYWEWyTvw8Rul3BAWw/exec'; 

async function fetchQuestionsFromSheet() {
    if (!SCRIPT_URL || SCRIPT_URL.includes('/dev')) return [];
    try {
        const response = await fetch(SCRIPT_URL);
        const result = await response.json();
        return result.status === 'success' ? result.data : [];
    } catch (error) { return []; }
}

async function saveToGoogleSheet(payload) {
    payload.action = 'submit'; 
    const btn = document.querySelector('.btn-submit-final');
    if(btn) { btn.disabled = true; btn.innerText = "Sedang Menyimpan..."; }

    try {
        await fetch(SCRIPT_URL, {
            method: 'POST', mode: 'no-cors', 
            body: JSON.stringify(payload),
            headers: { "Content-Type": "text/plain" }
        });
        return { status: 'success' };
    } catch (error) {
        alert("Gangguan koneksi."); return { status: 'error' }; 
    } finally {
        if(btn) { btn.disabled = false; btn.innerText = "Lihat Hasil Penilaian"; }
    }
}

async function fetchUserHistory(email) {
    try {
        const payload = { action: 'get_history', email: email };
        const response = await fetch(SCRIPT_URL, {
            method: 'POST', body: JSON.stringify(payload),
            headers: { "Content-Type": "text/plain" }
        });
        return await response.json();
    } catch (error) { return { status: 'error' }; }
}

// --- FUNGSI BARU UNTUK DETAIL ---
async function fetchSubmissionDetails(submissionId) {
    try {
        const payload = { action: 'get_submission_details', id: submissionId };
        const response = await fetch(SCRIPT_URL, {
            method: 'POST', body: JSON.stringify(payload),
            headers: { "Content-Type": "text/plain" }
        });
        return await response.json();
    } catch (error) { return { status: 'error' }; }
}
