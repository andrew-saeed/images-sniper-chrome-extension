<script setup>
    import { ref, onMounted } from 'vue'
    
    import ImageBox from './components/ImageBox.vue'
    import DownloadAllImagesBtn from './components/DownloadAllImagesBtn.vue'
    import Overlay from './theme/Overlay.vue'

    const imageCroppers = ref([])
    const addImageCropper = (imgCropper) => {
        imageCroppers.value.push(imgCropper)
    }
    
    const imageBoxes = ref([])
    const removeImageBox = (id) => {
        const index = imageBoxes.value.findIndex(box => box.id === id)
        if (index !== -1) {
            imageBoxes.value.splice(index, 1)
            imageCroppers.value.splice(index, 1)
        }
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
    <div id="app-layout" class="relative p-2">
        <header class="fixed top-0 left-0 z-10 w-full bg-black/70 px-2 pt-2">
            <h1 class="text-4xl text-white font-bold capitalize mb-3">
                <div v-if="imageBoxes.length === 0">
                    empty
                </div>           
                <DownloadAllImagesBtn :imageCroppers="imageCroppers" v-else />
            </h1>
        </header>
        <main>
            <ul class="mt-16 grid gap-[3.125rem]">
                <ImageBox
                    @add-image-cropper="addImageCropper"
                    @remove-image-box="removeImageBox" 
                    v-for="imageBox in imageBoxes"
                    :imageBox="imageBox" 
                    :key="imageBox.id" />
            </ul>
            <Overlay />
        </main>
    </div>
</template>