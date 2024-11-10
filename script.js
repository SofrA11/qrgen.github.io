document.getElementById("generateBtn").addEventListener("click", () => {
    const url = document.getElementById("urlInput").value;
    if (!url) return alert("Please enter a URL");

    const qrCodeDiv = document.getElementById("qrCode");
    qrCodeDiv.innerHTML = "";  // Očistimo prethodni QR kod

    new QRCode(qrCodeDiv, {
        text: url,
        width: 150,
        height: 150,
    });

    document.getElementById("saveQrBtn").style.display = "inline-block";
    document.getElementById("copyQrBtn").style.display = "inline-block";
});

document.getElementById("saveQrBtn").addEventListener("click", () => {
    const qrCodeDiv = document.getElementById("qrCode").querySelector("img");
    if (qrCodeDiv) {
        const link = document.createElement("a");
        link.href = qrCodeDiv.src;
        link.download = "QRCode.png";
        link.click();
    }
});

document.getElementById("copyQrBtn").addEventListener("click", async () => {
    const qrCodeDiv = document.getElementById("qrCode").querySelector("img");
    if (qrCodeDiv) {
        try {
            const response = await fetch(qrCodeDiv.src);
            const blob = await response.blob();
            await navigator.clipboard.write([
                new ClipboardItem({ "image/png": blob })
            ]);
            
        } catch (error) {
            console.error("Failed to copy QR Code as image", error);
            alert("Failed to copy QR Code. Try again.");
        }
    }
});

document.getElementById("qrImageInput").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        decodeQRCodeFromFile(file);
    }
});

document.addEventListener("paste", (event) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image")) {
            const file = items[i].getAsFile();
            decodeQRCodeFromFile(file);
        }
    }
});

document.getElementById("copyURLBtn").addEventListener("click", () => {
    const url = document.getElementById("decodedText").textContent;  // Koristite textContent
    if (!url) return alert("No URL to copy!");

    // Kopiraj URL u clipboard
    navigator.clipboard.writeText(url).then(() => {
        
    }).catch(err => {
        alert("Failed to copy URL: " + err);
    });
});

function decodeQRCodeFromFile(file) {
    const reader = new FileReader();
    reader.onload = function (event) {
        const img = new Image();
        img.src = event.target.result;

        img.onload = function () {
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0, canvas.width, canvas.height);

            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, canvas.width, canvas.height);

            if (code) {
                document.getElementById("decodedText").innerText = `${code.data}`;
                document.getElementById("decodedText").style.display = "block";
            } else {
                alert("No QR code found in the image.");
            }
        };
    };
    reader.readAsDataURL(file);
}

document.getElementById("uploadContainer").addEventListener("click", () => {
    document.getElementById("qrImageInput").click();
});

document.getElementById("uploadContainer").addEventListener("dragover", (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.style.backgroundColor = "#e2e6ea";
});

document.getElementById("uploadContainer").addEventListener("dragleave", (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.style.backgroundColor = "#f8f9fa";
});

document.getElementById("uploadContainer").addEventListener("drop", (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.style.backgroundColor = "#f8f9fa";
    const file = e.dataTransfer.files[0];
    if (file) {
        decodeQRCodeFromFile(file);
    }
});
