<template>
    <div>
        <header>
            <nav>
                <h1 class="logo">Wendy007</h1>
                <NuxtLink to="/">หน้าแรก</NuxtLink>
                <NuxtLink to="/books">ข้อมูลสินค้า</NuxtLink>
                <NuxtLink to="/about">Dashboard</NuxtLink>
            </nav>
        </header>
        <div>
            <slot />
        </div>
    </div>
</template>

<script setup>

</script>

<style scoped>
nav {
    width: 100%;
    padding: 10px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #2e40b2;
}

nav a {
    color: white;
    text-decoration: none;
    font-size: 18px;
    padding: 20px;
}

nav a:hover {
    color: aqua;
}

.logo {
    margin-right: auto;
    padding-left: 20px;
    color: white;
}
</style>