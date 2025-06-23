const title = document.title;

console.log(title);

function showToast() {
  // 既存のトーストがあれば削除
  const existing = document.getElementById("rc-toast");
  if (existing)
    existing.remove();

  // 色はライト/ダークで切り替え
  const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const themeColor = isDark ? '#28114E' : '#BCB2DB';
  const textColor = isDark ? '#fff' : '#000';

  // アニメーション用CSSを動的に挿入（重複防止）
  if (!document.getElementById("rc-toast-style")) {
    const style = document.createElement("style");
    style.id = "rc-toast-style";
    style.textContent = `
      @keyframes rc-toast-in {
        0% { opacity: 0; transform: scale(0.7); }
        100% { opacity: 1; transform: scale(1); }
      }
      @keyframes rc-toast-out {
        0% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(0.7); }
      }
      #rc-toast {
        animation: rc-toast-in 0.22s cubic-bezier(0.4,0,0.2,1);
      }
      #rc-toast.rc-toast-hide {
        animation: rc-toast-out 0.18s cubic-bezier(0.4,0,0.2,1) forwards;
      }
    `;
    document.head.appendChild(style);
  }

  const toast = document.createElement("div");
  toast.id = "rc-toast";
  toast.style.position = "fixed";
  toast.style.top = "12px";
  toast.style.right = "12px";
  toast.style.transformOrigin = "center top";
  toast.style.zIndex = "99999";
  toast.style.background = themeColor;
  toast.style.color = textColor;
  toast.style.display = "flex";
  toast.style.alignItems = "center";
  toast.style.padding = "7.5px 12.5px 7.5px 12.5px";
  toast.style.borderRadius = "10px";
  toast.style.boxShadow = "0 1.25px 7.5px rgba(0,0,0,0.18)";
  toast.style.fontSize = "15px";
  toast.style.fontWeight = "bold";
  toast.style.gap = "10px";
  toast.style.userSelect = "none";
  toast.style.pointerEvents = "none";

  toast.innerHTML = `
    <span>Copied Current URL</span>
    <span style=\"display:flex;align-items:center;justify-content:center;width:22.5px;height:22.5px;background:rgba(255,255,255,0.08);border-radius:6.25px;\">
      <svg width=\"15\" height=\"15\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">
        <rect x=\"9\" y=\"9\" width=\"10\" height=\"10\" rx=\"2\" stroke=\"${textColor}\" stroke-width=\"2\"/>
        <path d=\"M15 9V7C15 5.89543 14.1046 5 13 5H7C5.89543 5 5 5.89543 5 7V13C5 14.1046 5.89543 15 7 15H9\" stroke=\"${textColor}\" stroke-width=\"2\"/>
      </svg>
    </span>
  `;

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("rc-toast-hide");
    toast.addEventListener("animationend", () => toast.remove());
  }, 3000);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "copyCurrentTabUrl" && message.url) {
    navigator.clipboard.writeText(message.url).then(() => {
      showToast();
      console.log("URL copied to clipboard:", message.url);
    }).catch((err) => {
      console.error("Failed to copy URL:", err);
    });
  }
});
