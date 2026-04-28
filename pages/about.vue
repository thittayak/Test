<template>
  <div class="dashboard">
    <div class="header">
      <h1>📊 Dashboard</h1>
    </div>

    <!-- Stats Cards -->
    <div class="stats">
      <div class="stat-card">
        <div class="stat-icon">📚</div>
        <div class="stat-info">
          <h3>{{ totalBooks }}</h3>
          <p>จำนวนหนังสือทั้งหมด</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">💰</div>
        <div class="stat-info">
          <h3>฿{{ totalValue.toLocaleString() }}</h3>
          <p>มูลค่ารวม</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">📈</div>
        <div class="stat-info">
          <h3>฿{{ avgPrice.toLocaleString() }}</h3>
          <p>ราคาเฉลี่ย</p>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="table-section">
      <div class="table-header">
        <h2>📋 รายการหนังสือ</h2>
        <input 
          v-model="search" 
          type="text" 
          placeholder="🔍 ค้นหา..."
          class="search-input"
        />
      </div>

      <div class="loading" v-if="loading">กำลังโหลด...</div>

      <table v-else-if="filteredBooks.length">
        <thead>
          <tr>
            <th>#</th>
            <th>ปก</th>
            <th>ชื่อหนังสือ</th>
            <th>ผู้แต่ง</th>
            <th>ราคา</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(b, i) in filteredBooks" :key="b.id">
            <td>{{ i + 1 }}</td>
            <td><img :src="b.cover" class="table-cover" /></td>
            <td class="title">{{ b.title }}</td>
            <td>{{ b.author }}</td>
            <td class="price">฿{{ b.price?.toLocaleString() }}</td>
            <td class="actions">
            </td>
          </tr>
        </tbody>
      </table>

      <div class="empty" v-else>
        <p>ไม่พบหนังสือ</p>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: "WendyShop | DASHBOARD",
  meta: [
    { name: "description", content: "ร้านค้าหนังสือออนไลน์" }
  ]
})
import { ref, computed } from 'vue'

const books = ref([])
const loading = ref(true)
const search = ref('')

// Fetch books list
const fetchBooks = async () => {
  loading.value = true
  try {
    const res = await fetch('http://localhost:3001/books')
    books.value = await res.json()
  } catch (error) {
    console.error('Error fetching books:', error)
  } finally {
    loading.value = false
  }
}

// Computed stats
const totalBooks = computed(() => books.value.length)
const totalValue = computed(() => books.value.reduce((sum, b) => sum + (b.price || 0), 0))
const avgPrice = computed(() => totalBooks.value ? Math.round(totalValue.value / totalBooks.value) : 0)

// Filtered books
const filteredBooks = computed(() => {
  if (!search.value) return books.value
  const s = search.value.toLowerCase()
  return books.value.filter(b => 
    b.title?.toLowerCase().includes(s) || 
    b.author?.toLowerCase().includes(s)
  )
})

onMounted(() => {
  fetchBooks()
})
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #61a5e9 0%, #4874db 100%);
  padding: 30px;
}

.header {
  margin-bottom: 30px;
}

.header h1 {
  font-size: 2rem;
  color: #1f2937;
  margin-bottom: 4px;
}

.subtitle {
  color: #6b7280;
}

/* Stats */
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
}

.stat-card:nth-child(1) {
  border-left: 4px solid #667eea;
}

.stat-card:nth-child(2) {
  border-left: 4px solid #10b981;
}

.stat-card:nth-child(3) {
  border-left: 4px solid #f59e0b;
}

.stat-icon {
  font-size: 2.5rem;
}

.stat-info h3 {
  font-size: 1.8rem;
  color: #1f2937;
  margin-bottom: 4px;
}

.stat-info p {
  color: #6b7280;
  font-size: 0.9rem;
}

/* Table Section */
.table-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
}

.table-header h2 {
  color: #1f2937;
  font-size: 1.3rem;
}

.search-input {
  padding: 10px 20px;
  border: 2px solid #e5e7eb;
  border-radius: 30px;
  font-size: 0.95rem;
  width: 250px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.loading {
  text-align: center;
  padding: 40px;
  color: #6b7280;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: linear-gradient(135deg, #1f2937, #374151);
  color: white;
}

th, td {
  padding: 14px 12px;
  text-align: left;
}

th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
}

th:first-child {
  border-radius: 8px 0 0 8px;
}

th:last-child {
  border-radius: 0 8px 8px 0;
}

tbody tr {
  border-bottom: 1px solid #e5e7eb;
  transition: all 0.2s ease;
}

tbody tr:hover {
  background: #f9fafb;
}

.table-cover {
  width: 45px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.title {
  font-weight: 600;
  color: #1f2937;
}

.price {
  font-weight: 700;
  color: #059669;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn-edit, .btn-delete {
  padding: 6px 10px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn-edit {
  background: #fef3c7;
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
  padding: 60px;
  color: #6b7280;
}

.empty p {
  font-size: 1.2rem;
}
</style>
