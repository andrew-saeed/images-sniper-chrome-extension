<script setup>
    import { ref, onMounted } from 'vue'
    import { FolderArrowDownIcon } from '@heroicons/vue/24/solid'
    import JSZip from 'jszip'

    import ImageBox from './components/ImageBox.vue'
    import IconTextButton from './theme/IconTextButton.vue'

    const imageBoxes = ref([])
    const removeImageBox = (id) => {
        const index = imageBoxes.value.findIndex(box => box.id === id)
        if (index !== -1) imageBoxes.value.splice(index, 1)
    }
    const addImageBox = (src) => {
        const id = `${Date.now()}-${Math.floor(Math.random() * 1000)}`
        imageBoxes.value.push({id, src})
    }

    const imgCroppers = ref([])
    const addImageCropper = (imgCropper) => {
        imgCroppers.value.push(imgCropper)
    }
    const downloadAllImages = async () => {
        const zip = new JSZip()
        const imagesBlobs = imgCroppers.value.map(cropper => {

            return new Promise(resolve => {

                cropper.cropperIns.getCroppedCanvas().toBlob( blob => {
                    zip.file(`${cropper.id}-${cropper.imageName}`, blob)
                    resolve()
                })
            })
        })

        await Promise.all(imagesBlobs)
        
        const zipFile = await zip.generateAsync({type: 'blob'})
        const saveFileHandle = await window.showSaveFilePicker({
            suggestedName: 'image-sniper.zip',
            types: [{
                description: 'zip-file',
            }],
        })
        const writable = await saveFileHandle.createWritable()
        await writable.write(zipFile)
        await writable.close()
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
                <IconTextButton v-else @click="downloadAllImages">
                    <template #icon>
                        <FolderArrowDownIcon class="size-6 text-black"/>
                    </template>
                    <template #text>
                        download all images
                    </template>
                </IconTextButton>
            </h1>
        </header>
        <ul class="mt-16 grid gap-[3.125rem]">
            <ImageBox
                @add-image-cropper="addImageCropper"
                @remove-image-box="removeImageBox" 
                v-for="imageBox in imageBoxes"
                :imageBox="imageBox" 
                :key="imageBox.id" />
        </ul>
    </div>
</template>