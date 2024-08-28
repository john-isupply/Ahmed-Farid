// تأكد من تعريف المتغيرات في بداية الملف
let selectedMessageNumber = null;
let messages = [
    `مساء الخير يا دكتور\nمع حضرتك اى سبلاي\nبكلم حضرتك بخصوص اوردر مخزن\n{line1}\nصنف\n{line2}\nغير متوفر للاسف\nوالاوردر مش مكمل فاتوره\nوتم الغاء الاوردر\nوتم وضع الاودر علي الكارت\nلحين تكمله الاوردر من خلال حضرتك واعاده الطباعه مره اخرى\nللمزيد من المعلومات برجاء التواصل مع خدمه العملاء \n01222219995`,
    `مساء الخير يا دكتور\nمع حضرتك اى سبلاي\nبكلم حضرتك بخصوص اوردر مخزن\n{line1}\nصنف\n{line2}\nغير متوفر للاسف\nواصبحت قيمه الاوردر \n{line4}\nالحد الادنى للمخزن هو \n{line5}\nوالاوردر مش مكمل فاتوره\nبرجاء تكمله الاوردر \nللمزيد من المعلومات برجاء التواصل مع خدمه العملاء \n01222219995`,
    `مساء الخير يا دكتور\nمع حضرتك اى سبلاي\nبكلم حضرتك بخصوص اوردر مخزن\n{line1}\nصنف\n{line2}\nكوته من خلال المخزن \n{line3} علب\nوالاوردر مش مكمل فاتوره\nوتم الغاء الاوردر\nوتم وضع الاودر علي الكارت\nلحين تكمله الاوردر من خلال حضرتك واعاده الطباعه مره اخرى\nللمزيد من المعلومات برجاء التواصل مع خدمه العملاء \n01222219995`,
    `مساء الخير يا دكتور\nمع حضرتك اى سبلاي\nبكلم حضرتك بخصوص اوردر مخزن\n{line1}\nصنف\n{line2}\nهناك خطا فيه نسبه الخصم للصنف\nوهايوصل لحضرتك بخصم  \n{line3}%\nللمزيد من المعلومات برجاء التواصل مع خدمه العملاء \n01222219995`
];

// Function to fetch data from Google Sheets using the provided URL
async function fetchSheetData() {
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbwStk0jJqascaCp_HYs0Qn2VTMliNdYq6OofDUhTcpu48-teJkNex-rYIzZJ7AM7Ley4w/exec');
        const data = await response.json();

        // تحقق من البيانات المستلمة
        console.log("Received data:", data);

        // تحديث الحقول بالبيانات من Google Sheets فقط إذا كانت القيمة موجودة وغير فارغة
        if (data['Customer Phone']) {
            document.getElementById('whatsapp-number').value = data['Customer Phone'];
        }
        if (data['Seller Name']) {
            document.getElementById('line1').value = data['Seller Name'];
        }
        if (data['Order ID']) {
            document.getElementById('order-id').value = data['Order ID'];
        }
        if (data['Grand Total']) {
            document.getElementById('line4').value = data['Grand Total'];
        }
        if (data['Min Order']) {
            document.getElementById('line5').value = data['Min Order'];
        }
        if (data['Item Names F']) {
            document.getElementById('line2').value = data['Item Names F'].join('\n');
        } else {
            console.warn('No item names found in Item Names F!');
        }

        // إذا كانت البيانات فارغة، امسح الحقل line3
        window.kotaData = data['Item Names G'] ? data['Item Names G'][0] : '';
        document.getElementById('line3').value = window.kotaData || '';

        updateMessagePreview(); // تحديث معاينة الرسالة بالبيانات الجديدة

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// دالة لتحديث البيانات من جوجل شيت عند النقر على الزر
function refreshData() {
    fetchSheetData();
}

// تأكد من استدعاء هذه الوظيفة عند تحميل الصفحة أو عند الحاجة
document.addEventListener('DOMContentLoaded', fetchSheetData);

// Function to update the message preview based on form inputs
function updateMessagePreview() {
    if (selectedMessageNumber !== null) {
        const line1 = document.getElementById('line1').value;
        const line2 = document.getElementById('line2').value;
        const line3 = document.getElementById('line3').value || "";
        const line4 = document.getElementById('line4').value;
        const line5 = document.getElementById('line5').value;

        let message = messages[selectedMessageNumber - 1]
            .replace("{line1}", line1)
            .replace("{line2}", line2)
            .replace("{line3}", line3)
            .replace("{line4}", line4)
            .replace("{line5}", line5);

        document.getElementById('message-preview').value = message;
    }
}

// Function to select a message template
function selectMessage(messageNumber) {
    selectedMessageNumber = messageNumber;
    const messageItems = document.querySelectorAll('.message-item');
    messageItems.forEach((item, index) => {
        if (index === messageNumber - 1) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
    updateMessagePreview();

    const line3Label = document.getElementById('line3-label');
    const line3Input = document.getElementById('line3');
    if (messageNumber === 3) { // كوته
        line3Label.textContent = "كوته";
        line3Label.style.display = 'block';
        line3Input.style.display = 'block';
        // استخدم بيانات عمود G من Google Sheets لحقل line3
        line3Input.value = window.kotaData;
    } else if (messageNumber === 4) { // فرق خصم
        line3Label.textContent = "فرق خصم";
        line3Label.style.display = 'block';
        line3Input.style.display = 'block';
    } else {
        line3Label.style.display = 'none';
        line3Input.style.display = 'none';
    }
}

// Function to toggle settings menu visibility
function toggleSettings() {
    const settingsContainer = document.getElementById('settings-container');
    settingsContainer.classList.toggle('show');
    if (settingsContainer.classList.contains('show')) {
        document.getElementById('message1').value = messages[0];
        document.getElementById('message2').value = messages[1];
        document.getElementById('message3').value = messages[2];
        document.getElementById('message4').value = messages[3];
    } else {
        const fontSize = localStorage.getItem('fontSize') || 16;
        document.getElementById('message-preview').style.fontSize = `${fontSize}px`;
    }
}

// Function to save the message settings
function saveSettings() {
    messages[0] = document.getElementById('message1').value;
    messages[1] = document.getElementById('message2').value;
    messages[2] = document.getElementById('message3').value;
    messages[3] = document.getElementById('message4').value;

    localStorage.setItem('messages', JSON.stringify(messages)); // Save messages to localStorage

    toggleSettings();
}

// Function to send the message to WhatsApp
function sendMessage() {
    if (selectedMessageNumber === null) {
        alert("Please select a message first.");
        return;
    }

    // استخدم الرسالة الموجودة في معاينة الرسالة عند الإرسال
    let message = document.getElementById('message-preview').value;

    let whatsappNumber = document.getElementById('whatsapp-number').value;
    if (!whatsappNumber.startsWith('+2')) {
        whatsappNumber = '+2' + whatsappNumber;
    }

    const whatsappLink = document.getElementById('whatsapp-link');
    whatsappLink.href = 'whatsapp://send?phone=' + encodeURIComponent(whatsappNumber) + '&text=' + encodeURIComponent(message);
    whatsappLink.style.display = 'block';
    whatsappLink.click();
}

// Function to send a fixed WhatsApp link message
function sendLink() {
    const orderId = document.getElementById('order-id').value;
    const fixedNumber = document.getElementById('fixed-whatsapp-link').dataset.fixedNumber || "+201050971225"; // Default to Yasser's number
    const fixedMessage = orderId;

    const fixedWhatsappLink = document.getElementById('fixed-whatsapp-link');
    fixedWhatsappLink.href = 'whatsapp://send?phone=' + encodeURIComponent(fixedNumber) + '&text=' + encodeURIComponent(fixedMessage);
    fixedWhatsappLink.style.display = 'block';
    fixedWhatsappLink.click();
}

// Function to update the fixed number based on the selected contact
function updateFixedNumber() {
    const dropdown = document.getElementById('contact-dropdown');
    const selectedNumber = dropdown.value;
    if (selectedNumber) {
        document.getElementById('fixed-whatsapp-link').dataset.fixedNumber = selectedNumber;
    } else {
        document.getElementById('fixed-whatsapp-link').dataset.fixedNumber = "+201050971225"; // Default number
    }
}

// Open the Google Sheet
function openGoogleSheet() {
    window.open('https://docs.google.com/spreadsheets/d/1aTa0Um7tj8aCHqPWekWI6qPwry4h6Ngq1xBQoL-vaFY/edit?gid=0#gid=0', '_blank');
}

// Event listeners for input changes to update the message preview
document.getElementById('line1').addEventListener('input', updateMessagePreview);
document.getElementById('line2').addEventListener('input', updateMessagePreview);
document.getElementById('line3').addEventListener('input', updateMessagePreview);
document.getElementById('line4').addEventListener('input', updateMessagePreview);
document.getElementById('line5').addEventListener('input', updateMessagePreview);

// Event listeners for keyboard navigation and actions
document.querySelectorAll('.message-item').forEach((item) => {
    item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            selectMessage(Array.from(item.parentNode.children).indexOf(item) + 1);
            document.getElementById('line1').focus();
        }
    });
});

document.getElementById('line1').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('line2').focus();
    }
});

document.getElementById('line2').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        document.getElementById('line3').focus();
    } else if (e.key === 'Enter' && e.shiftKey) {
        const input = document.getElementById('line2');
        const start = input.selectionStart;
        const end = input.selectionEnd;

        input.value = input.value.substring(0, start) + '\n' + input.value.substring(end);
        input.selectionStart = input.selectionEnd = start + 1;
        e.preventDefault();
    }
});

document.getElementById('line3').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('line4').focus(); // Move focus to Grand Total
    }
});

document.getElementById('line4').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('line5').focus(); // Move focus to Min Order
    }
});

document.getElementById('line5').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
        document.getElementById('order-id').focus(); // Move focus to Order ID
    }
});

document.getElementById('order-id').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        sendLink();
    }
});

// On page load, fetch sheet data and set up the page
document.addEventListener('DOMContentLoaded', async () => {
    await fetchSheetData();
    const fontSize = localStorage.getItem('fontSize') || 16;
    document.getElementById('message-preview').style.fontSize = `${fontSize}px`;

    // Load saved messages from localStorage if available
    const savedMessages = JSON.parse(localStorage.getItem('messages'));
    if (savedMessages) {
        messages = savedMessages;
    }
});
