let currentImageURL = null;
const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const resultDiv = document.getElementById("result");
const loadingDiv = document.getElementById("loading");

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragover");
  const file = e.dataTransfer.files[0];
  handleFile(file);
});

dropZone.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  handleFile(file);
});

function handleFile(file) {
  if (!file || !file.type.startsWith("image/")) {
    alert("File harus berupa gambar.");
    return;
  }
  removeBackground(file);
}

async function removeBackground(file) {
  const formData = new FormData();
  formData.append("image_file", file);
  formData.append("size", "auto");

  resultDiv.innerHTML = "";
  loadingDiv.classList.remove("hidden");

  try {
    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": "rVeN1E7oov3L92Ezkk9oL66b"
      },
      body: formData
    });

    loadingDiv.classList.add("hidden");

    if (!response.ok) throw new Error("Gagal menghapus latar belakang. Coba lagi.");

    const blob = await response.blob();
    currentImageURL = URL.createObjectURL(blob);

    resultDiv.innerHTML = `
      <div class="checkerboard p-2 rounded-xl">
        <img src="${currentImageURL}" alt="Result" class="rounded-xl shadow-md max-w-full h-auto" />
      </div>
      <p class="mt-2 text-sm text-gray-600">Nama file: <strong>${file.name}</strong></p>
      <p class="text-sm text-gray-600">Ukuran file: <strong>${(file.size / 1024 / 1024).toFixed(2)} MB</strong></p>

      <div class="mt-4 flex flex-wrap gap-3 justify-center">
        <a href="${currentImageURL}" download="no-bg.png" class="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition select-none">
          Download Gambar
        </a>
        <button onclick="toggleShare()" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2">
          <i class="ph ph-share-fat"></i> Bagikan
        </button>
      </div>

      <div id="shareOptions" class="hidden mt-4 flex flex-wrap gap-3 justify-center">
        <a href="https://wa.me/?text=Coba%20hapus%20background%20gambar%20di%20https://bartzyy5.github.io/removebg.offcial/" target="_blank" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2">
          <i class="ph ph-whatsapp-logo"></i> WhatsApp
        </a>
        <a href="https://www.facebook.com/sharer/sharer.php?u=https://bartzyy5.github.io/removebg.offcial/" target="_blank" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2">
          <i class="ph ph-facebook-logo"></i> Facebook
        </a>
        <a href="https://twitter.com/intent/tweet?url=https://bartzyy5.github.io/removebg.offcial/" target="_blank" class="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-xl flex items-center gap-2">
          <i class="ph ph-twitter-logo"></i> Twitter
        </a>
        <a href="https://discord.com/channels/@me" target="_blank" class="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2">
          <i class="ph ph-discord-logo"></i> Discord
        </a>
        <a href="https://www.instagram.com/" target="_blank" class="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-xl flex items-center gap-2">
          <i class="ph ph-instagram-logo"></i> Instagram
        </a>
      </div>
    `;
  } catch (error) {
    loadingDiv.classList.add("hidden");
    resultDiv.innerHTML = `<p class="text-red-500 font-semibold">${error.message}</p>`;
  }
}

function toggleShare() {
  const shareDiv = document.getElementById("shareOptions");
  shareDiv.classList.toggle("hidden");
}

function resetAll() {
  resultDiv.innerHTML = "";
  fileInput.value = "";
  currentImageURL = null;
}
