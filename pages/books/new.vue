<template>
  <div class="page">
    <div class="card">
      <h1>📚 เพิ่มหนังสือใหม่</h1>
      
      <form @submit.prevent="addBook" class="form">
        <div class="preview">
          <img v-if="previewUrl" :src="previewUrl" class="preview-img">
        </div>

        <div class="form-group">
          <label>ชื่อหนังสือ</label>
          <input 
            v-model="form.title" 
            type="text" 
            placeholder="กรอกชื่อหนังสือ"
            required 
          />
        </div>

        <div class="form-group">
          <label>ผู้แต่ง</label>
          <input 
            v-model="form.author" 
            type="text" 
            placeholder="กรอกชื่อผู้แต่ง"
            required 
          />
        </div>

        <div class="form-group">
          <label>ราคา (บาท)</label>
          <input 
            v-model.number="form.price" 
            type="number" 
            placeholder="กรอกราคา"
            min="0"
            required 
          />
        </div>

        <div class="form-group">
          <label>รูปปกหนังสือ</label>
          <input 
            type="file" 
            accept="image/*" 
            @change="onFileChange"
            class="file-input"
            required
          />
        </div>

        <div class="actions">
          <button type="submit" class="btn btn-save" :disabled="loading">
            {{ loading ? '⏳ กำลังบันทึก...' : '💾 บันทึก' }}
          </button>
          <NuxtLink to="/books" class="btn btn-cancel">❌ ยกเลิก</NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: "WendyShop | เพิ่มหนังสือ",
  meta: [
    { name: "description", content: "ร้านค้าหนังสือออนไลน์" }
  ]
})
const router = useRouter()

const form = ref({
  title: '',
  author: '',
  price: 0,
  cover: ''
})

const selectedFile = ref(null)
const previewUrl = ref('')
const loading = ref(false)

const onFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
  selectedFile.value = file
  previewUrl.value = URL.createObjectURL(file)
}
  const img = new Image()
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    img.src = reader.result
  }
  img.onload = () => {
    // สร้าง canvas
    const canvas = document.createElement("canvas")
    // ขนาดที่ต้องการ (ย่อรูป)
    const MAX_WIDTH = 300
    const scale = MAX_WIDTH / img.width
    canvas.width = MAX_WIDTH
    canvas.height = img.height * scale
    const ctx = canvas.getContext("2d")
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    // แปลงเป็น base64 แบบบีบ
    const compressed = canvas.toDataURL("image/jpeg", 0.6)
    form.value.cover = compressed
    previewUrl.value = URL.createObjectURL(file)
  }
}

const addBook = async () => {
  loading.value = true
  
  try {
    // Upload image first
    if (selectedFile.value) {
      const formData = new FormData()
      formData.append('cover', selectedFile.value)
      
      const uploadRes = await $fetch('http://localhost:3001/upload', {
        method: 'POST',
        body: formData
      })
      form.value.cover = uploadRes.url
    }
    
    // Save book
    await $fetch('http://localhost:3001/books', {
      method: 'POST',
      body: form.value
    })
    
    alert('เพิ่มหนังสือสำเร็จ!')
    router.push('/books')
  } catch (error) {
    console.error('Error adding book:', error)
    alert('เกิดข้อผิดพลาดในการเพิ่มหนังสือ')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>

/* ===== Background ===== */
.page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background:
    radial-gradient(circle at 20% 10%, #8fa2ff 0%, transparent 40%),
    radial-gradient(circle at 80% 90%, #6b7bff 0%, transparent 40%),
    linear-gradient(135deg, #61a5e9, #4874db);
  padding: 40px;
}

/* ===== Card ===== */
.card {
  background: rgba(255,255,255,0.96);
  backdrop-filter: blur(14px);
  padding: 38px 42px 42px;
  border-radius: 30px;
  box-shadow: 0 35px 100px rgba(0,0,0,0.28);
  width: 100%;
  max-width: 520px;
  transition: transform .25s ease;
}

/* ===== Title ===== */
h1 {
  text-align: center;
  margin-bottom: 26px;
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: .5px;
  background: linear-gradient(135deg,#5a67d8,#7c8cff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* ===== Book Cover Preview ===== */
.preview {
  display: flex;
  justify-content: center;
  margin-bottom: 26px;
}

.preview-img {
  width: 220px;
  height: 320px;
  object-fit: cover;
  border-radius: 16px;
  background: #f1f3f9;
  box-shadow:
    0 18px 40px rgba(0,0,0,0.28),
    inset 0 0 0 1px rgba(255,255,255,0.4);
  transition: transform .25s ease, box-shadow .25s ease;
}

.preview-img:hover {
  transform: scale(1.04);
  box-shadow: 0 30px 70px rgba(0,0,0,0.35);
}

/* ===== Form Layout ===== */
.form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 700;
  color: #374151;
  font-size: .92rem;
}

/* ===== Inputs ===== */
.form-group input {
  padding: 14px 16px;
  border: 2px solid #e6e8f2;
  border-radius: 14px;
  font-size: .98rem;
  background: #fafbff;
  transition: all .25s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #6c7bff;
  background: white;
  box-shadow: 0 0 0 4px rgba(108,123,255,.15);
}

.form-group input::placeholder {
  color: #9aa3b2;
}

/* ===== File Upload ===== */
.file-input {
  background: #f1f3ff !important;
  border: 2px dashed #c7cdfa !important;
  cursor: pointer;
}

.file-input::-webkit-file-upload-button {
  background: linear-gradient(135deg,#5a67d8,#7c8cff);
  color: white;
  border: none;
  padding: 8px 18px;
  border-radius: 10px;
  cursor: pointer;
  margin-right: 12px;
  font-weight: 600;
  transition: .25s;
}

.file-input::-webkit-file-upload-button:hover {
  filter: brightness(1.1);
}

/* ===== Buttons ===== */
.actions {
  display: flex;
  gap: 14px;
  margin-top: 20px;
}

.btn {
  flex: 1;
  padding: 14px 24px;
  border-radius: 14px;
  font-weight: 700;
  letter-spacing: .3px;
  cursor: pointer;
  transition: all .25s ease;
  text-align: center;
}

/* Save */
.btn-save {
  background: linear-gradient(135deg,#22c55e,#16a34a);
  color: white;
}

.btn-save:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(34,197,94,.45);
}

.btn-save:disabled {
  opacity: .6;
  cursor: not-allowed;
}

/* Cancel */
.btn-cancel {
  background: #eef0f6;
  color: #374151;
}

.btn-cancel:hover {
  background: #e2e6f3;
  transform: translateY(-2px);
}

/* ===== Responsive ===== */
@media (max-width: 600px) {
  .card {
    padding: 28px 22px 30px;
  }

  .preview-img {
    width: 180px;
    height: 260px;
  }
}

</style>
