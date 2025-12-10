const video = document.getElementById("video");
const output = document.getElementById("output");
const openBtn = document.getElementById("openBtn");

function startCamera() {
    navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
    })
        .then(stream => {
            video.srcObject = stream;
            scanQRCode();
        })
        .catch(err => {
            output.innerHTML = "Camera blocked! Please allow permissions.";
        });
}

function scanQRCode() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    function scan() {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, canvas.width, canvas.height);

            if (code) {
                output.innerHTML = "Scanned: " + code.data;

                if (code.data.startsWith("http")) {
                    openBtn.style.display = "block";
                    openBtn.onclick = () => window.open(code.data, "_blank");
                }

                return; // stop scanning once detected
            }
        }

        requestAnimationFrame(scan);
    }

    scan();
}

startCamera();
