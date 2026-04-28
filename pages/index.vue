<!-- runfront npm run dev -->
<template>
  <div class="page">
    <div class="header">
      <h1>📚 WendyShop - ร้านหนังสือ</h1>
      <p class="subtitle">ค้นหาหนังสือที่คุณชื่นชอบ</p>
    </div>

    <div class="search-box">
      <input 
        v-model="search" 
        type="text" 
        placeholder="🔍 ค้นหาหนังสือ..."
        @input="fetchBooks"
      />
    </div>

    <div class="loading" v-if="pending">กำลังโหลด...</div>

    <div class="books-grid" v-else-if="books && books.length">
      <div v-for="book in books" :key="book.id" class="book-card">
        <img :src="book.cover" class="book-cover" />
        <div class="book-info">
          <h3 class="book-title">{{ book.title }}</h3>
          <p class="book-author">โดย {{ book.author }}</p>
          <p class="book-price">฿{{ book.price }}</p>
        </div>
      </div>
    </div>

    <div class="empty" v-else>
      <p>😢 ไม่พบหนังสือ</p>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: "WendyShop | หน้าแรก",
  meta: [
    { name: "description", content: "ร้านค้าหนังสือออนไลน์" }
  ]
})

const search = ref('')
const books = ref([])
const pending = ref(true)

const fetchBooks = async () => {
  pending.value = true
  try {
    const url = search.value 
      ? `http://localhost:3001/books?search=${encodeURIComponent(search.value)}`
      : 'http://localhost:3001/books'
    const data = await $fetch(url)
    books.value = data
  } catch (error) {
    console.error('Error fetching books:', error)
  } finally {
    pending.value = false
  }
}

onMounted(() => {
  fetchBooks()
})
</script>

<style scoped>
.page {
  padding: 40px;
  min-height: 100vh;
  background: linear-gradient(135deg, #61a5e9 0%, #4874db 100%);
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

h1 {
  color: white;
  font-size: 2.5rem;
  text-shadow: 0 2px 10px rgba(0,0,0,0.2);
  margin-bottom: 8px;
}

.subtitle {
  color: rgba(255,255,255,0.85);
  font-size: 1.1rem;
}

.search-box {
  max-width: 500px;
  margin: 0 auto 40px;
}

.search-box input {
  width: 100%;
  padding: 16px 24px;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
  transition: all 0.3s ease;
}

.search-box input:focus {
  outline: none;
  box-shadow: 0 10px 40px rgba(0,0,0,0.25);
}

.loading {
  text-align: center;
  color: white;
  padding: 60px;
  font-size: 1.2rem;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.book-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
}

.book-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 50px rgba(0,0,0,0.3);
}

.book-cover {
  width: 100%;
  height: 280px;
  object-fit: cover;
}

.book-info {
  padding: 16px;
}

.book-title {
  font-size: 1.1rem;
  color: #1f2937;
  margin-bottom: 4px;
  font-weight: 600;
}

.book-author {
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 8px;
}

.book-price {
  font-size: 1.2rem;
  font-weight: 700;
  color: #059669;
}

.empty {
  text-align: center;
  padding: 80px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  max-width: 400px;
  margin: 0 auto;
}

.empty p {
  font-size: 1.5rem;
  color: #6b7280;
}
</style>
