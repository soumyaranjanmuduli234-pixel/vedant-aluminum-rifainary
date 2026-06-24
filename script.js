/* ================================= */
/* VEDANTA REFINERY REPORT SYSTEM */
/* ADVANCED VERSION WITH PREMIUM FIX */
/* ================================= */

document.addEventListener("DOMContentLoaded", function(){
    initializeSystem();
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
/* AUTOMATIC SYNCS & COUNTERS */
/* ============================== */
function setupLiveListeners() {
    // Dynamic Auto Fill Signature Listener
    const nameInput = document.getElementById("employeeName");
    nameInput.addEventListener("input", function() {
        document.getElementById("pDigitalSignature").innerText = this.value;
    });

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
    
    document.getElementById("pDigitalSignature").innerText = document.getElementById("employeeName").value;
    
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
    
    document.getElementById("pDigitalSignature").innerText = document.getElementById("employeeName").value;
    
    let txt = document.getElementById("workDetails").value.trim();
    let words = txt === "" ? 0 : txt.split(/\s+/).length;
    document.getElementById("charCount").innerText = document.getElementById("workDetails").value.length + " characters | " + words + " words";
}

function attachAutoSave(){
    const elements = document.querySelectorAll("input, textarea, select");
    elements.forEach(function(item){
        item.addEventListener("item", function(){
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

/* COMPATIBILITY ERROR FIXED PDF ENGINE */
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
        // Safe download async execution callback
    }).save();
}

function printReport(){
    generatePreview();
    window.print();
}

/* FIX: CLEARS LOCALSTORAGE, FORM FIELDS, PREVIEW AND REFRESHES */
function clearData(){
    if(confirm("Kya aap saara input data delete karke page reset karna chahte hain?")){
        localStorage.removeItem("vedanta_report_data");
        localStorage.removeItem("vedanta_bill_no");
        
        // Reset inputs
        const inputs = document.querySelectorAll("input, textarea, select");
        inputs.forEach(item => {
            if(item.id !== "location") item.value = "";
        });

        // Reset previews elements
        const previewSpans = document.querySelectorAll("#pdfReport span, #pdfReport td, #pdfReport .digital-signature");
        previewSpans.forEach(span => span.innerText = "");
        
        document.getElementById("pExpenseWords").innerText = "";
        
        // Page reload to apply state clean up completely
        location.reload();
    }
}

setInterval(function(){ generateDateTime(); }, 1000);