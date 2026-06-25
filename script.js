/* ======================================= */
/* VEDANTA REFINERY REPORT SOFTWARE ENGINE */
/* ======================================= */

let canvas, ctx, isDrawing = false;

document.addEventListener("DOMContentLoaded", function(){
    setupAdvancedSecurity();
    initializeSystem();
    initSignaturePad();
});

function setupAdvancedSecurity() {
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        showSecurityToast();
    });

    document.addEventListener('keydown', function(e) {
        if (
            e.keyCode === 123 || 
            (e.ctrlKey && e.shiftKey && e.keyCode === 73) || 
            (e.ctrlKey && e.shiftKey && e.keyCode === 74) || 
            (e.ctrlKey && e.keyCode === 85) 
        ) {
            e.preventDefault();
            showSecurityToast();
        }
    });
}

function showSecurityToast() {
    const toast = document.getElementById("securityToast");
    if(!toast) return;
    toast.style.top = "20px";
    setTimeout(() => { toast.style.top = "-120px"; }, 3000);
}

function initializeSystem(){
    loadTheme();
    generateBillNumber();
    generateDateTime();
    loadSavedData();
    calculateBalance();
    attachAutoSave();
    setupLiveListeners();
}

function initSignaturePad() {
    canvas = document.getElementById("sigCanvas");
    if (!canvas) return;
    ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#0056b3"; 
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";

    canvas.addEventListener("mousedown", (e) => { isDrawing = true; draw(e); });
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", () => { isDrawing = false; ctx.beginPath(); saveSignatureToStorage(); });
    
    canvas.addEventListener("touchstart", (e) => {
        isDrawing = true;
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent("mousedown", { clientX: touch.clientX, clientY: touch.clientY });
        canvas.dispatchEvent(mouseEvent);
        e.preventDefault();
    });
    canvas.addEventListener("touchmove", (e) => {
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent("mousemove", { clientX: touch.clientX, clientY: touch.clientY });
        canvas.dispatchEvent(mouseEvent);
        e.preventDefault();
    });
    canvas.addEventListener("touchend", () => { isDrawing = false; ctx.beginPath(); saveSignatureToStorage(); });
}

function draw(e) {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function clearSignature() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById("sigImage").style.display = "none";
    document.getElementById("sigImage").src = "";
    localStorage.removeItem("vedanta_signature");
}

function saveSignatureToStorage() {
    localStorage.setItem("vedanta_signature", canvas.toDataURL());
}

function calculateBalance(){
    let advance = parseFloat(document.getElementById("advance").value) || 0;
    let expense = parseFloat(document.getElementById("expense").value) || 0;
    
    let balance = 0;
    let required = 0;

    if(expense > advance) {
        balance = 0.00;
        required = expense - advance;
    } else {
        balance = advance - expense;
        required = 0.00;
    }
    
    document.getElementById("balance").value = balance.toFixed(2);
    document.getElementById("required").value = required.toFixed(2);

    let percentage = advance > 0 ? Math.min(Math.round((expense / advance) * 100), 100) : (expense > 0 ? 100 : 0);
    const fillBar = document.getElementById("dynamicProgressBar");
    const txtPercent = document.getElementById("usagePercentage");
    
    if(fillBar && txtPercent) {
        fillBar.style.width = percentage + "%";
        txtPercent.innerText = percentage + "% Used";
        fillBar.style.backgroundColor = percentage > 90 ? "#dc2626" : (percentage > 65 ? "#d97706" : "#059669");
    }
}

function setupLiveListeners() {
    const workInput = document.getElementById("workDetails");
    workInput.addEventListener("input", function() {
        let text = this.value.trim();
        let wordCount = text === "" ? 0 : text.split(/\s+/).length;
        document.getElementById("charCount").innerText = this.value.length + " characters | " + wordCount + " words";
    });

    document.getElementById("employeeMob").addEventListener("input", function() {
        this.value = this.value.replace(/[^0-9]/g, '');
    });

    const expenseInput = document.getElementById("expense");
    const advanceInput = document.getElementById("advance");
    [expenseInput, advanceInput].forEach(input => {
        input.addEventListener("input", function() {
            calculateBalance();
            updateAmountInWords(expenseInput.value);
        });
    });
}

function copyWorkDetails() {
    const text = document.getElementById("workDetails").value;
    if(!text) return;
    navigator.clipboard.writeText(text);
    alert("Text Copied Successfully!");
}

function updateAmountInWords(amount) {
    let amt = parseFloat(amount) || 0;
    let wordBox = document.getElementById("pExpenseWords");
    if (!wordBox) return;
    if(amt === 0) { wordBox.innerText = ""; return; }
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

function generateBillNumber(){
    const existingBill = localStorage.getItem("vedanta_bill_no");
    if(existingBill){ document.getElementById("billNo").value = existingBill; return; }
    const billNo = "VAB-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000);
    document.getElementById("billNo").value = billNo;
    localStorage.setItem("vedanta_bill_no", billNo);
}

function generateDateTime(){
    const dateElement = document.getElementById("dateTime");
    if(dateElement) dateElement.value = new Date().toLocaleString("en-IN", { year:"numeric", month:"long", day:"numeric", hour:"2-digit", minute:"2-digit", second:"2-digit" });
}

function generatePreview(){
    calculateBalance();
    const fields = ["employeeName", "employeeId", "department", "location", "employeeMob", "employeeRole", "billNo", "dateTime", "reportHeading", "workDetails", "advance", "expense", "balance", "required"];
    const targets = ["pEmployeeName", "pEmployeeId", "pDepartment", "pLocation", "pEmployeemobilenumber", "pEmployeeroll", "pBillNo", "pDate", "pHeading", "pWork", "pAdvance", "pExpense", "pBalance", "pRequired"];
    
    fields.forEach((f, i) => {
        let val = document.getElementById(f).value || "";
        if(["advance", "expense", "balance", "required"].includes(f)) {
            let num = parseFloat(val) || 0;
            document.getElementById(targets[i]).innerText = "₹ " + num.toFixed(2);
        } else {
            document.getElementById(targets[i]).innerText = val;
        }
    });
    
    const currentStatus = document.getElementById("status").value;
    const pStatus = document.getElementById("pStatus");
    pStatus.innerText = currentStatus.toUpperCase();
    if(currentStatus === "Completed") { pStatus.style.background = "#d1fae5"; pStatus.style.color = "#065f46"; }
    else if(currentStatus === "In Progress") { pStatus.style.background = "#fef3c7"; pStatus.style.color = "#92400e"; }
    else { pStatus.style.background = "#fee2e2"; pStatus.style.color = "#991b1b"; }

    const savedSig = localStorage.getItem("vedanta_signature");
    document.getElementById("sigImage").src = savedSig || "";
    document.getElementById("sigImage").style.display = savedSig ? "block" : "none";
    
    const wrapper = document.getElementById("pdfReportWrapper");
    if(wrapper) {
        wrapper.className = "print-forced-visible pdf-container-show";
    }
    
    saveData();
}

function saveData(){
    const syncBadge = document.getElementById("syncBadge");
    if(syncBadge) { syncBadge.innerText = "⏳ Saving..."; syncBadge.style.color = "#d97706"; }

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

    setTimeout(() => {
        if(syncBadge) { syncBadge.innerText = "🟢 Auto-Sync Saved"; syncBadge.style.color = "#059669"; }
    }, 400);
}

function loadSavedData(){
    const data = localStorage.getItem("vedanta_report_data");
    if(!data) return;
    const formData = JSON.parse(data);
    for(const key in formData){
        if(document.getElementById(key)) document.getElementById(key).value = formData[key];
    }
    const savedSig = localStorage.getItem("vedanta_signature");
    if (savedSig && canvas) {
        const img = new Image(); img.src = savedSig;
        img.onload = () => ctx.drawImage(img, 0, 0);
    }
    updateAmountInWords(document.getElementById("expense").value);
}

function attachAutoSave(){
    document.querySelectorAll("input, textarea, select").forEach(item => {
        item.addEventListener("input", () => {
            if(!["billNo", "dateTime", "balance", "required"].includes(item.id)) {
                calculateBalance();
                saveData();
            }
        });
    });
}

function toggleTheme(){
    document.body.classList.toggle("dark");
    localStorage.setItem("vedanta_theme", document.body.classList.contains("dark") ? "dark" : "light");
}
function loadTheme(){
    if(localStorage.getItem("vedanta_theme") === "dark") document.body.classList.add("dark");
}

function triggerClearModal() {
    const modal = document.getElementById("clearConfirmModal");
    if(modal) modal.classList.add("active");
}

function confirmClearData(shouldClear) {
    const modal = document.getElementById("clearConfirmModal");
    if(modal) modal.classList.remove("active");
    
    if(shouldClear) {
        localStorage.clear();
        location.reload();
    }
}

function downloadPDF(){
    generatePreview();
    const report = document.getElementById("pdfReport");
    
    const options = {
        margin: [12, 12, 12, 12], 
        filename: "Vedanta_Premium_Report_" + (document.getElementById("billNo").value || "Report") + ".pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2.5, useCORS: true, logging: false, letterRendering: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    };
    
    setTimeout(() => { 
        if (typeof html2pdf !== 'undefined') {
            html2pdf().set(options).from(report).save(); 
        } else {
            window.print();
        }
    }, 400);
}

function printReport(){ 
    generatePreview(); 
    setTimeout(() => {
        window.print(); 
    }, 300);
}

setInterval(generateDateTime, 1000);