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
    <div id="app-layout" class="p-2">
        <h1 class="text-4xl text-white font-bold capitalize mb-3">{{ imageBoxes.length ? `${imageBoxes.length} images` : 'Empty' }}</h1>
        <ul class="grid gap-[3.125rem]">
            <ImageBox @remove-image-box="removeImageBox" v-for="imageBox in imageBoxes" :imageBox="imageBox" :key="imageBox.id" />
        </ul>
    </div>
</template>