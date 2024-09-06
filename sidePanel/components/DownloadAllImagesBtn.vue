<script setup>
import {ref} from 'vue'
import JSZip from 'jszip'
import { FolderArrowDownIcon, Cog8ToothIcon } from '@heroicons/vue/24/solid'
import IconTextButton from '../theme/IconTextButton.vue'

const props = defineProps(['imageCroppers'])

const downloadState = ref('idle')
let imageCroppersProcessed = 0
const generatingProgress = ref(0)
const zipFileProgress = ref(0)

const updateGeneratingProgress = () => {
    imageCroppersProcessed++
    generatingProgress.value = Math.round((imageCroppersProcessed / props.imageCroppers.length) * 100)
}

const downloadAllImages = async () => {
    if(downloadState.value !== 'idle') return

    downloadState.value = 'generating'
    let saveFileHandle = null
    try {
        saveFileHandle = await window.showSaveFilePicker({
            suggestedName: 'image-sniper.zip',
            types: [{
                description: 'zip-file',
            }],
        })
    } catch {
        return downloadState.value = 'idle'
    }
    const zip = new JSZip()
    const imagesBlobs = props.imageCroppers.map(cropper => {

        return new Promise(resolve => {

            cropper.cropperIns.getCroppedCanvas().toBlob( blob => {
                zip.file(`${cropper.id}-${cropper.imageName}`, blob)
                updateGeneratingProgress()
                resolve()
            })
        })
    })
    await Promise.all(imagesBlobs)
    
    downloadState.value = 'packaging'
    const zipFile = await zip.generateAsync({type: 'blob'}, metadata => {
        zipFileProgress.value = Math.round(metadata.percent)
    })
    const writable = await saveFileHandle.createWritable()
    await writable.write(zipFile)
    await writable.close()

    downloadState.value = 'idle'
    imageCroppersProcessed = 0
    generatingProgress.value = 0
}
</script>
<template>
    <IconTextButton @click="downloadAllImages" :disabled="downloadState !== 'idle'">
        <template #icon>
            <FolderArrowDownIcon v-if="downloadState === 'idle'" class="size-6 text-black"/>
            <Cog8ToothIcon v-else-if="downloadState === 'generating' || downloadState === 'packaging'" class="size-6 text-black animate-spin"/>
        </template>
        <template #text>
            <span v-if="downloadState === 'idle'">download all images</span>
            <span v-else-if="downloadState === 'generating'">generating images {{ generatingProgress }}%</span>
            <span v-else-if="downloadState === 'packaging'">packaging all {{ zipFileProgress }}%</span>
        </template>
    </IconTextButton>
</template>