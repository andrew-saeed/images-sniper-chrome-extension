<script setup>
    import { ref, onMounted } from 'vue'

    import ImageBox from './components/ImageBox.vue'

    const imageBoxes = ref([])
    const removeImageBox = (id) => {
        const index = imageBoxes.value.findIndex(box => box.id === id)
        if (index !== -1) imageBoxes.value.splice(index, 1)
    }
    const addImageBox = (src) => {
        const id = `${Date.now()}-${Math.floor(Math.random() * 1000)}`
        imageBoxes.value.push({id, src})
    }

    onMounted(() => {
        chrome.runtime.connect({name: "side-panel-toggle"})

        chrome.runtime.onMessage.addListener(async (request, sender, reply) => {
        
            if(request.action === "img_shoot") addImageBox(request.src)
        })
    })
</script>
<template>
    <h1>{{ imageBoxes.length ? `${imageBoxes.length} images` : 'Empty' }}</h1>
    <ul>
        <ImageBox @remove-image-box="removeImageBox" v-for="imageBox in imageBoxes" :imageBox="imageBox" :key="imageBox.id" />
    </ul>
</template>
<style lang="scss">
    ul {
        list-style: none;
        display: grid;
        gap: 3.125rem;
        padding: 0;
        margin: 0;
    }
</style>