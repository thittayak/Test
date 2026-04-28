<template>
  <div class="page">
    <div class="card">
      <h1>แก้ไข</h1>
      <div class="cover-section">
        <img :src="previewUrl || book?.cover" class="cover-img" />
        <div class="cover-overlay" v-if="isEditing">
          <input type="file" accept="image/*" @change="onFileChange" />
        </div>
      </div>

      <div class="detail">
        <div class="header">
          <h1 v-if="!isEditing">{{ book?.title }}</h1>
          <input v-else v-model="form.title" type="text" placeholder="ชื่อหนังสือ" class="input-title" />
        </div>

        <div class="info">
          <div class="info-row">
            <span class="label">ผู้แต่ง:</span>
            <span v-if="!isEditing">{{ book?.author }}</span>
            <input v-else v-model="form.author" type="text" placeholder="ผู้แต่ง" />
          </div>

          <div class="info-row">
            <span class="label">ราคา:</span>
            <span v-if="!isEditing" class="price">฿{{ book?.price }}</span>
            <input v-else v-model.number="form.price" type="number" placeholder="ราคา" />
          </div>
        </div>

        <div class="actions">
          <template v-if="!isEditing">
            <button @click="startEdit" class="btn btn-edit">แก้ไข</button>
            <button @click="deleteBook" class="btn btn-delete">ลบ</button>
            <NuxtLink to="/books" class="btn btn-back">← กลับ</NuxtLink>
          </template>
          <template v-else>
            <button @click="saveBook" class="btn btn-save">บันทึก</button>
            <button @click="cancelEdit" class="btn btn-cancel">ยกเลิก</button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()
const id = route.params.id

const { data: book } = await useFetch(`http://localhost:3001/books/${id}`)

const isEditing = ref(false)
const selectedFile = ref(null)
const previewUrl = ref(null)
const form = ref({
  title: '',
  author: '',
  price: 0,
  cover: ''
})

const startEdit = () => {
  form.value = {
    title: book.value?.title || '',
    author: book.value?.author || '',
    price: book.value?.price || 0,
    cover: book.value?.cover || ''
  }
  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
}

const saveBook = async () => {
  try {

    if (selectedFile.value) {
      const formData = new FormData()
      formData.append('cover', selectedFile.value)

      const uploadRes = await $fetch('http://localhost:3001/upload', {
        method: 'POST',
        body: formData
      })

      form.value.cover = uploadRes.url
    }

    // 🔥 ค่อย update book
    const updated = await $fetch(`http://localhost:3001/books/${id}`, {
      method: 'PUT',
      body: form.value
    })

    book.value = updated
    isEditing.value = false
    previewUrl.value = null
    selectedFile.value = null

    alert('บันทึกสำเร็จ!')

  } catch (error) {
    console.error('Error saving book:', error)
    alert('เกิดข้อผิดพลาดในการบันทึก')
  }
}

// Initialize form with book data for cover preview
watchEffect(() => {
  if (book.value && !isEditing.value) {
    form.value.cover = book.value.cover
  }
})

const onFileChange = (event) => {
  const file = event.target.files[0]
  if (!file) return

  selectedFile.value = file
  previewUrl.value = URL.createObjectURL(file)

  const img = new Image()
  const reader = new FileReader()

  reader.readAsDataURL(file)
  reader.onload = () => img.src = reader.result

  img.onload = () => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    //จำกัดขนาดจริง
    const MAX_WIDTH = 600
    const scale = MAX_WIDTH / img.width
    canvas.width = MAX_WIDTH
    canvas.height = img.height * scale

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = "high"
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

    //บีบอัตโนมัติ
    let quality = 0.9
    let base64 = canvas.toDataURL("image/jpeg", quality)

    // เป้าหมาย < 200KB
    while (base64.length > 200000 && quality > 0.3) {
      quality -= 0.05
      base64 = canvas.toDataURL("image/jpeg", quality)
    }

    console.log("Final size:", Math.round(base64.length / 1024), "KB")

    form.value.cover = base64
  }
}

</script>

<style scoped>
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

/* CARD */
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

.card:hover {
  transform: translateY(-4px);
}

h1 {
  text-align: center;
  margin-bottom: 26px;
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: .5px;
  background: linear-gradient(135deg,#5a67d8,#3d0000);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* COVER */
.cover-section {
  position: relative;
  display: flex;
  justify-content: center;
  margin-bottom: 26px;
}

.cover-img {
  width: 100%;
  max-width: 280px;
  height: auto;
  object-fit: contain;    
  border-radius: 16px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.25);
  background: #f3f4f6;
}

/* overlay upload */
.cover-overlay {
  position: absolute;
  inset: auto 0 0 0;
  padding: 14px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.75));
  border-radius: 0 0 16px 16px;
  display: flex;
  justify-content: center;
}

.cover-overlay input {
  width: 100%;
  font-size: 0.85rem;
  color: white;
}

/* DETAIL */
.detail {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.header h1 {
  font-size: 3rem;
  line-height: 1.2;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #2b2b2b, #4b4bd2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.input-title {
  font-size: 1.8rem;
  text-align: center;
  font-weight: 700;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 16px;
  width: 94%;
  margin: 0 auto;
  display: block;
}

.input-title:focus {
  outline: none;
  border-color: #667eea;
}

/* INFO */
.info {
  margin: 20px 0 26px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-row {
  display: grid;
  grid-template-columns: 90px 1fr;
  align-items: center;
  gap: 10px;
}

.label {
  font-size: 1.5rem;
  font-weight: 600;
  color: #011641;
}

.info-row span:not(.label) {
  font-size: 1.5rem;
  color: #00245d;
}

.price {
  font-weight: 700;
  color: #059669 !important;
  font-size: 1.5rem !important;
}

.info-row input {
  padding: 9px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1.5rem;
}

.info-row input:focus {
  outline: none;
  border-color: #667eea;
}

/* BUTTONS */
.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: auto;
}

.btn {
  padding: 11px 18px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  transition: 0.25s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn:hover {
  transform: translateY(-2px);
}

/* COLORS */
.btn-edit { background: linear-gradient(135deg,#f59e0b,#d97706); color:white;}
.btn-delete { background: linear-gradient(135deg,#ef4444,#dc2626); color:white;}
.btn-back { background: linear-gradient(135deg,#6b7280,#4b5563); color:white;}
.btn-save { background: linear-gradient(135deg,#10b981,#059669); color:white;}
.btn-cancel { background: linear-gradient(135deg,#8c8c8c,#92a8c7); color:white;}

.btn:hover {
  box-shadow: 0 8px 25px rgba(0,0,0,0.25);
}

/* MOBILE */
@media (max-width: 768px) {
  .card {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .info-row {
    grid-template-columns: 1fr;
    gap: 4px;
    text-align: left;
  }

  .cover-img {
    max-width: 260px;
    margin: auto;
  }

  .actions {
    justify-content: center;
  }
}
</style>

