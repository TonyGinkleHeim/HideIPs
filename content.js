function hideIPs() {
    const ipRegex = /\b(?:\d{1,3}\.){3}\d{1,3}\b(:\d{1,5})?\b/g;

    document.querySelectorAll("body *").forEach(element => {
        if (element.childNodes.length === 1 && element.childNodes[0].nodeType === 3) {
            let text = element.textContent;
            let matches = [...text.matchAll(ipRegex)];

            if (matches.length > 0) {
                let newElement = document.createElement("span");
                let lastIndex = 0;

                matches.forEach(match => {
                    let ip = match[0];
                    let index = match.index;

                    newElement.appendChild(document.createTextNode(text.substring(lastIndex, index)));

                    let spoiler = document.createElement("span");
                    spoiler.textContent = "[Click to Reveal]";
                    spoiler.style.cursor = "pointer";
                    spoiler.style.color = "red";
                    spoiler.dataset.ip = ip;
                    spoiler.dataset.revealed = false; 

                    spoiler.classList.add("rainbow");

                    spoiler.addEventListener("click", function () {
                        if (this.dataset.revealed === "false") {
                            this.innerHTML = applyRainbowEffect(this.dataset.ip, 'white');
                            this.dataset.revealed = true; 
                        } else {
                            copyToClipboard(this.dataset.ip);
                        }
                    });

                    newElement.appendChild(spoiler);
                    lastIndex = index + ip.length;
                });

                newElement.appendChild(document.createTextNode(text.substring(lastIndex)));

                element.replaceWith(newElement);
            }
        }
    });
}

function applyRainbowEffect(text, color) {
    return text
        .split("")
        .map((char) => {
            return `<span class="rainbow" style="color: ${color};">${char}</span>`;
        })
        .join("");
}

function copyToClipboard(ip) {
    const textArea = document.createElement("textarea");
    textArea.value = ip;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);

    const copiedMessage = document.createElement("div");
    copiedMessage.textContent = "Copied!";
    copiedMessage.style.position = "fixed";
    copiedMessage.style.bottom = "20px";
    copiedMessage.style.left = "50%";
    copiedMessage.style.transform = "translateX(-50%)";
    copiedMessage.style.padding = "10px";
    copiedMessage.style.backgroundColor = "green";
    copiedMessage.style.color = "white";
    copiedMessage.style.fontSize = "16px";
    copiedMessage.style.borderRadius = "5px";
    copiedMessage.style.zIndex = "9999";

    document.body.appendChild(copiedMessage);

    setTimeout(() => {
        copiedMessage.style.display = "none";
    }, 3000);
}

function showPopup(message) {
    const popup = document.createElement("div");
    popup.textContent = message;
    popup.style.position = "fixed";
    popup.style.bottom = "20px";
    popup.style.left = "50%";
    popup.style.transform = "translateX(-50%)";
    popup.style.backgroundColor = "#333";
    popup.style.color = "#fff";
    popup.style.padding = "10px 20px";
    popup.style.borderRadius = "5px";
    popup.style.fontSize = "14px";
    popup.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    popup.style.zIndex = "9999";
    popup.style.opacity = "0";
    popup.style.transition = "opacity 0.5s ease-in-out";

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.style.opacity = "1";
    }, 100);

    setTimeout(() => {
        popup.style.opacity = "0";
        setTimeout(() => {
            popup.remove();
        }, 500);
    }, 3000);
}

const style = document.createElement("style");
style.innerHTML = `
    @keyframes rainbow-animation {
        0% { color: #ff0000; }
        14% { color: #ff7f00; }
        28% { color: #ffff00; }
        42% { color: #00ff00; }
        57% { color: #0000ff; }
        71% { color: #4b0082; }
        85% { color: #8b00ff; }
        100% { color: #ff0000; }
    }

    .rainbow {
        font-weight: bold;
        display: inline-block;
    }

    .rainbow:hover {
        animation: rainbow-animation 1s infinite;
    }
`;

document.head.appendChild(style);

document.addEventListener("DOMContentLoaded", hideIPs);
new MutationObserver(hideIPs).observe(document.body, { childList: true, subtree: true });
