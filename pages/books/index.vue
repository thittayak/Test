<template>
  <div class="page">
    <div class="header">
      <h1>📚 รายการหนังสือ</h1>
      <NuxtLink to="/books/new" class="btn-add">
        ➕ เพิ่มหนังสือ
      </NuxtLink>
    </div>

    <div class="search-box">
      <input v-model="search" type="text" placeholder="🔍 ค้นหาหนังสือ..." @input="fetchBooks" />
    </div>

    <div class="loading" v-if="pending">กำลังโหลด...</div>

    <table v-else-if="books && books.length">
      <thead>
        <tr>
          <th>#</th>
          <th>ปก</th>
          <th>ชื่อหนังสือ</th>
          <th>ผู้แต่ง</th>
          <th>ราคา</th>
          <th>จัดการ</th>
        </tr>
      </thead>
      <tbody>
        <th @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'" style="cursor:pointer">
          ราคา
          <span v-if="sortOrder === 'asc'">⬆️</span>
          <span v-else>⬇️</span>
        </th>

        <tr v-for="(b, i) in sortedBooks" :key="b.id">
          <td>{{ i + 1 }}</td>
          <td><img :src="b.cover" class="cover" /></td>
          <td>
            <NuxtLink :to="`/books/${b.id}`" class="book-link">
              {{ b.title }}
            </NuxtLink>
          </td>
          <td>{{ b.author }}</td>
          <td class="price">฿{{ b.price }}</td>
          <td class="actions">
            <NuxtLink :to="`/books/${b.id}`" class="btn-edit">✏️</NuxtLink>
            <button @click="deleteBook(b.id)" class="btn-delete">🗑️</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="empty" v-else>
      <p>ไม่พบหนังสือ</p>
      <NuxtLink to="/books/new" class="btn-add">เพิ่มหนังสือเล่มแรก</NuxtLink>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: "WendyShop | รายการ",
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

const deleteBook = async (id) => {
  if (!confirm('คุณต้องการลบหนังสือเล่มนี้หรือไม่?')) return

  try {
    await $fetch(`http://localhost:3001/books/${id}`, {
      method: 'DELETE'
    })
    await fetchBooks()
  } catch (error) {
    console.error('Error deleting book:', error)
    alert('เกิดข้อผิดพลาดในการลบหนังสือ')
  }
}

const sortOrder = ref('asc') // asc = น้อย→มาก , desc = มาก→น้อย

const sortedBooks = computed(() => {
  return [...books.value].sort((a, b) => {
    return sortOrder.value === 'asc'
      ? a.price - b.price
      : b.price - a.price
  })
})

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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

h1 {
  color: white;
  font-size: 2rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.btn-add {
  background: linear-gradient(135deg, #11998e, #38ef7d);
  color: white;
  padding: 12px 24px;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(17, 153, 142, 0.4);
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(17, 153, 142, 0.6);
}

.search-box {
  margin-bottom: 25px;
}

.search-box input {
  width: 95%;
  padding: 16px 24px;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.search-box input:focus {
  outline: none;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25);
}

.loading {
  text-align: center;
  color: white;
  padding: 60px;
  font-size: 1.2rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

thead {
  background: linear-gradient(135deg, #1f2937, #374151);
  color: white;
}

th,
td {
  padding: 16px;
  text-align: left;
}

th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

tbody tr {
  border-bottom: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

tbody tr:hover {
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  transform: scale(1.01);
}

.cover {
  width: 60px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.book-link {
  color: #4f46e5;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.book-link:hover {
  color: #7c3aed;
}

.price {
  font-weight: 700;
  color: #059669;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn-edit,
.btn-delete {
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  margin-top: 20px
}

.btn-edit {
  background: #fef3c7;
  text-decoration: none;
}

.btn-edit:hover {
  background: #fde68a;
  transform: scale(1.1);
}

.btn-delete {
  background: #fee2e2;
}

.btn-delete:hover {
  background: #fecaca;
  transform: scale(1.1);
}

.empty {
  text-align: center;
  padding: 80px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.empty p {
  font-size: 1.5rem;
  color: #6b7280;
  margin-bottom: 20px;
}
</style>
