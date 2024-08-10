<script setup>
    defineProps(['imageBox'])
</script>
<template>
    <li>
        <p>
            <img :src="imageBox.src" alt="sniper image">
        </p>
        <div>
            <button @click="$emit('removeImageBox', imageBox.id)">delete</button>
        </div>
    </li>
</template>
<style lang="scss">
    img {
        width: 100%;
    }
</style>