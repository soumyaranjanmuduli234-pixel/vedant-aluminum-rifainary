/* ================================= */
/* VEDANTA REFINERY REPORT SYSTEM */
/* ADVANCED VERSION WITH PREMIUM FIX */
/* ================================= */

let canvas, ctx, isDrawing = false;

document.addEventListener("DOMContentLoaded", function(){
    initializeSystem();
    initSignaturePad();
});

function initializeSystem(){
    loadTheme();
    generateBillNumber();
    generateDateTime();
    loadSavedData();
    calculateBalance();
    attachAutoSave();
    setupLiveListeners();
}

/* ============================== */
/* DIGITAL SIGNATURE ENGINE SETUP */
/* ============================== */
function initSignaturePad() {
    canvas = document.getElementById("sigCanvas");
    if (!canvas) return;
    ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#0056b3"; // Professional Blue Ink
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";

    // Mouse Events
    canvas.addEventListener("mousedown", (e) => { isDrawing = true; draw(e); });
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", () => { isDrawing = false; ctx.beginPath(); saveSignatureToStorage(); });
    canvas.addEventListener("mouseout", () => isDrawing = false);

    // Touch Events for Mobile/Tabs
    canvas.addEventListener("touchstart", (e) => {
        isDrawing = true;
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent("mousedown", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
        e.preventDefault();
    });
    canvas.addEventListener("touchmove", (e) => {
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent("mousemove", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
        e.preventDefault();
    });
    canvas.addEventListener("touchend", () => {
        isDrawing = false;
        ctx.beginPath();
        saveSignatureToStorage();
    });
}

function draw(e) {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    
    // Scaling calculations to support dynamic screen ratios
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function clearSignature() {
    if(!canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById("sigImage").style.display = "none";
    document.getElementById("sigImage").src = "";
    localStorage.removeItem("vedanta_signature");
}

function saveSignatureToStorage() {
    const dataURL = canvas.toDataURL();
    localStorage.setItem("vedanta_signature", dataURL);
}

/* ============================== */
/* AUTOMATIC SYNCS & COUNTERS */
/* ============================== */
function setupLiveListeners() {
    // Work Details Live Char & Word Counter
    const workInput = document.getElementById("workDetails");
    workInput.addEventListener("input", function() {
        let text = this.value.trim();
        let wordCount = text === "" ? 0 : text.split(/\s+/).length;
        document.getElementById("charCount").innerText = this.value.length + " characters | " + wordCount + " words";
    });

    // Status Live Border Glowing Feedback
    const statusSelect = document.getElementById("status");
    statusSelect.addEventListener("change", function() {
        updateStatusGlow(this.value);
    });
    updateStatusGlow(statusSelect.value);

    // Expense Amount to Words Trigger
    const expenseInput = document.getElementById("expense");
    expenseInput.addEventListener("input", function() {
        updateAmountInWords(this.value);
    });
}

function copyWorkDetails() {
    const text = document.getElementById("workDetails").value;
    if(!text) { alert("Copy karne ke liye koi text nahi hai!"); return; }
    navigator.clipboard.writeText(text);
    alert("Work details text clipboard par copy ho gaya hai!");
}

function updateStatusGlow(val) {
    const statusSelect = document.getElementById("status");
    if(val === "Pending") {
        statusSelect.style.borderColor = "#dc2626";
        statusSelect.style.boxShadow = "0 0 8px rgba(220, 38, 38, 0.2)";
    } else if(val === "In Progress") {
        statusSelect.style.borderColor = "#d97706";
        statusSelect.style.boxShadow = "0 0 8px rgba(217, 119, 6, 0.2)";
    } else {
        statusSelect.style.borderColor = "#059669";
        statusSelect.style.boxShadow = "0 0 8px rgba(5, 150, 105, 0.2)";
    }
}

function updateAmountInWords(amount) {
    let amt = parseFloat(amount) || 0;
    let wordBox = document.getElementById("pExpenseWords");
    if (!wordBox) return;
    
    if(amt === 0) {
        wordBox.innerText = "";
        return;
    }
    wordBox.innerText = "Amount in Words: Rupee " + numberToWords(Math.floor(amt)) + " Only";
}

function numberToWords(num) {
    const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    if (num === 0) return 'Zero';
    
    function convert(n) {
        if (n < 20) return a[n];
        if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
        if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + convert(n % 100) : '');
        if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + convert(n % 1000) : '');
        return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + convert(n % 100000) : '');
    }
    return convert(num);
}

/* ============================== */
/* BILL & DATETIME GENERATORS */
/* ============================== */
function generateBillNumber(){
    const existingBill = localStorage.getItem("vedanta_bill_no");
    if(existingBill && existingBill !== "undefined" && existingBill !== ""){
        document.getElementById("billNo").value = existingBill;
        return;
    }
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    const billNo = "VAB-" + year + "-" + random;
    document.getElementById("billNo").value = billNo;
    localStorage.setItem("vedanta_bill_no", billNo);
}

function generateDateTime(){
    const now = new Date();
    const options = { year:"numeric", month:"long", day:"numeric", hour:"2-digit", minute:"2-digit", second:"2-digit" };
    const dateText = now.toLocaleString("en-IN", options);
    const dateElement = document.getElementById("dateTime");
    if(dateElement) dateElement.value = dateText;
}

/* ============================== */
/* EXPENSE & BADGES TRACKER */
/* ============================== */
function calculateBalance(){
    let advance = parseFloat(document.getElementById("advance").value) || 0;
    let expense = parseFloat(document.getElementById("expense").value) || 0;
    let balance = advance - expense;
    
    document.getElementById("balance").value = balance.toFixed(2);
    
    let required = 0;
    if(balance < 0){
        required = Math.abs(balance);
    }
    document.getElementById("required").value = required.toFixed(2);
}

function updateStatusBadge(statusValue) {
    const badge = document.getElementById("pStatus");
    badge.innerText = statusValue.toUpperCase();
    badge.className = "status-badge"; 
    
    if(statusValue === "Pending") {
        badge.style.background = "#fee2e2";
        badge.style.color = "#dc2626";
    } else if(statusValue === "In Progress") {
        badge.style.background = "#fef3c7";
        badge.style.color = "#d97706";
    } else {
        badge.style.background = "#d1fae5";
        badge.style.color = "#059669";
    }
}

/* ============================== */
/* REPORT PREVIEW GENERATION */
/* ============================== */
function generatePreview(){
    calculateBalance();
    
    setText("pEmployeeName", "value", "employeeName");
    setText("pEmployeeId", "value", "employeeId");
    setText("pDepartment", "value", "department");
    setText("pLocation", "value", "location");
    setText("pEmployeemobilenumber", "value", "employeeMob");
    setText("pEmployeeroll", "value", "employeeRole");
    setText("pBillNo", "value", "billNo");
    setText("pDate", "value", "dateTime");
    setText("pHeading", "value", "reportHeading");
    setText("pWork", "value", "workDetails");
    
    // Sync Drawn Signature into Report Preview Wrapper
    const savedSig = localStorage.getItem("vedanta_signature");
    const sigImg = document.getElementById("sigImage");
    if (savedSig) {
        sigImg.src = savedSig;
        sigImg.style.display = "block";
    } else {
        sigImg.style.display = "none";
    }
    
    updateStatusBadge(document.getElementById("status").value);
    updateAmountInWords(document.getElementById("expense").value);
    
    document.getElementById("pAdvance").innerText = "₹ " + (parseFloat(document.getElementById("advance").value) || 0).toFixed(2);
    document.getElementById("pExpense").innerText = "₹ " + (parseFloat(document.getElementById("expense").value) || 0).toFixed(2);
    document.getElementById("pBalance").innerText = "₹ " + (parseFloat(document.getElementById("balance").value) || 0).toFixed(2);
    document.getElementById("pRequired").innerText = "₹ " + (parseFloat(document.getElementById("required").value) || 0).toFixed(2);
    
    saveData();
}

function setText(target, type, source){
    const srcEl = document.getElementById(source);
    const tgtEl = document.getElementById(target);
    if(srcEl && tgtEl) tgtEl.innerText = srcEl[type] || "";
}

/* ============================== */
/* STORAGE SYSTEM */
/* ============================== */
function saveData(){
    const formData = {
        employeeName: document.getElementById("employeeName").value,
        employeeId: document.getElementById("employeeId").value,
        employeeMob: document.getElementById("employeeMob").value,
        employeeRole: document.getElementById("employeeRole").value,
        department: document.getElementById("department").value,
        reportHeading: document.getElementById("reportHeading").value,
        workDetails: document.getElementById("workDetails").value,
        status: document.getElementById("status").value,
        location: document.getElementById("location").value,
        advance: document.getElementById("advance").value,
        expense: document.getElementById("expense").value
    };
    localStorage.setItem("vedanta_report_data", JSON.stringify(formData));
}

function loadSavedData(){
    const data = localStorage.getItem("vedanta_report_data");
    if(!data) return;
    
    const formData = JSON.parse(data);
    for(const key in formData){
        const element = document.getElementById(key);
        if(element) element.value = formData[key];
    }
    
    // Load Signature Pad state if exist
    const savedSig = localStorage.getItem("vedanta_signature");
    if (savedSig && canvas) {
        const img = new Image();
        img.src = savedSig;
        img.onload = function() {
            ctx.drawImage(img, 0, 0);
        };
    }
    
    let txt = document.getElementById("workDetails").value.trim();
    let words = txt === "" ? 0 : txt.split(/\s+/).length;
    document.getElementById("charCount").innerText = document.getElementById("workDetails").value.length + " characters | " + words + " words";
}

function attachAutoSave(){
    const elements = document.querySelectorAll("input, textarea, select");
    elements.forEach(function(item){
        item.addEventListener("input", function(){
            if(item.id !== "billNo" && item.id !== "dateTime" && item.id !== "balance" && item.id !== "required") {
                calculateBalance();
                saveData();
            }
        });
    });
}

/* ============================== */
/* UTILITIES & THEME */
/* ============================== */
function toggleTheme(){
    document.body.classList.toggle("dark");
    localStorage.setItem("vedanta_theme", document.body.classList.contains("dark") ? "dark" : "light");
}

function loadTheme(){
    if(localStorage.getItem("vedanta_theme") === "dark") document.body.classList.add("dark");
}

function downloadPDF(){
    generatePreview();
    if(typeof html2pdf === "undefined") {
        alert("Library error! Please connect to internet to download PDF first.");
        return;
    }
    
    const report = document.getElementById("pdfReport");
    report.style.display = "block";
    report.style.visibility = "visible";

    const options = {
        margin: [10, 10, 10, 10],
        filename: "Vedanta_Report_" + document.getElementById("billNo").value + ".pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { 
            scale: 2, 
            useCORS: true, 
            logging: false,
            letterRendering: true
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    };

    html2pdf().set(options).from(report).toPdf().get('pdf').then(function (pdf) {
        // Asynchronous structural safe download mapping
    }).save();
}

function printReport(){
    generatePreview();
    window.print();
}

/* HIGH-TECH RESET: CLEARS EVERYTHING & FORCES FULL FRESH CLEAN STATE HOIST REBOOT */
function clearData(){
    if(confirm("Do you want to clear all data?")){
        localStorage.clear(); // Complete wipe out including signatures
        
        const inputs = document.querySelectorAll("input, textarea, select");
        inputs.forEach(item => {
            if(item.id !== "location") item.value = "";
        });

        const previewSpans = document.querySelectorAll("#pdfReport span, #pdfReport td");
        previewSpans.forEach(span => span.innerText = "");
        
        document.getElementById("pExpenseWords").innerText = "";
        document.getElementById("sigImage").style.display = "none";
        document.getElementById("sigImage").src = "";
        
        if (canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Force fully refresh the system immediately
        location.reload();
    }
}

setInterval(function(){ generateDateTime(); }, 1000);


// Modern Glass-Frame Alert System
function showGlassAlert(message, type = 'success', duration = 4000) {
    // Create alert container if it doesn't exist
    let alertContainer = document.getElementById('glassAlertContainer');
    if (!alertContainer) {
        alertContainer = document.createElement('div');
        alertContainer.id = 'glassAlertContainer';
        alertContainer.className = 'glass-alert-container';
        document.body.appendChild(alertContainer);
    }

    // Create alert element
    const alert = document.createElement('div');
    alert.className = `glass-alert glass-alert-${type}`;
    
    const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
    
    alert.innerHTML = `
        <div class="glass-alert-content">
            <span class="glass-alert-icon">${icon}</span>
            <span class="glass-alert-message">${message}</span>
        </div>
    `;
    
    alertContainer.appendChild(alert);
    
    // Trigger animation
    setTimeout(() => {
        alert.classList.add('show');
    }, 10);
    
    // Remove alert after duration
    setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => {
            alert.remove();
        }, 300);
    }, duration);
}