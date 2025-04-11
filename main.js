function debounce(fn, delay) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

function updateMask() {
  const overlay = document.querySelector(".overlay");
  const overlayRect = overlay.getBoundingClientRect();
  const maskContent = document.getElementById("mask-content");
  maskContent.innerHTML = "";

  const container = document.getElementById("text");
  const containerRect = container.getBoundingClientRect();

  const holes = document.querySelectorAll(".hole");
  holes.forEach((hole) => {
    const prev = hole.previousElementSibling;
    const next = hole.nextElementSibling;
    let gapPx = 0;

    const MIN_WIDTH_PX = 200;

    if (
      prev &&
      prev.classList.contains("word") &&
      next &&
      next.classList.contains("word")
    ) {
      const prevRect = prev.getBoundingClientRect();
      const nextRect = next.getBoundingClientRect();

      gapPx = nextRect.left - prevRect.right;
    } else if (prev && prev.classList.contains("word")) {
      const prevRect = prev.getBoundingClientRect();

      gapPx = containerRect.right - prevRect.right;
    } else if (next && next.classList.contains("word")) {
      const nextRect = next.getBoundingClientRect();

      gapPx = nextRect.left - containerRect.left;
    }

    if (gapPx < MIN_WIDTH_PX) gapPx = MIN_WIDTH_PX;

    // пиксели в vw
    const gapVw = (gapPx / window.innerWidth) * 100;
    hole.style.width = gapVw + "vw";

    // отрисовка пробелов
    const rect = hole.getBoundingClientRect();
    const x = (rect.left - overlayRect.left) / overlayRect.width;
    const y = (rect.top - overlayRect.top) / overlayRect.height;
    const w = rect.width / overlayRect.width;
    const h = rect.height / overlayRect.height;
    const newRect = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );

    newRect.setAttribute("x", x);
    newRect.setAttribute("y", y);
    newRect.setAttribute("width", w);
    newRect.setAttribute("height", h);
    newRect.setAttribute("fill", "black");
    maskContent.appendChild(newRect);
  });
}

const debouncedUpdateMask = debounce(updateMask, 150);

window.addEventListener("resize", debouncedUpdateMask);
window.addEventListener("DOMContentLoaded", updateMask);
