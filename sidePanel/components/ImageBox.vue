<script setup>
    import Cropper from 'cropperjs'
    import { onMounted, ref, computed } from 'vue'
    import { TrashIcon, FolderArrowDownIcon } from '@heroicons/vue/24/solid'
    import IconButton from '../theme/IconButton.vue'

    const props = defineProps(['imageBox'])

    const imgRef = ref(null)
    const imgWidth = ref('')
    const imgHeight = ref('')
    const cropperRef = ref(null)

    const download = () => {
        cropperRef.value.getCroppedCanvas().toBlob((blob) => {

            // get the image name
            const imageUrl = new URL(props.imageBox.src);
            const segments = imageUrl.pathname.split('/');
            const fileName = segments[segments.length - 1];

            // download the canvas-image blob
            const blobUrl = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = blobUrl
            a.download = decodeURIComponent(fileName)
            document.body.appendChild(a)
            a.click()
            URL.revokeObjectURL(blobUrl)
            document.body.removeChild(a)
        })
    }

    onMounted(() => {
        cropperRef.value = new Cropper(imgRef.value, {
            aspectRatio: 16 / 9,
            responsive: false,
        })
        imgRef.value.addEventListener('ready', () => {
            imgWidth.value = `${imgRef.value.naturalWidth}px`
            imgHeight.value = `${imgRef.value.naturalHeight}px`
        })
    })
</script>
<template>
    <li>
        <img class="w-full" ref="imgRef" :src="imageBox.src" alt="sniper image">
        <div class="text-xl mt-6">
            <p><span class="font-bold capitalize">original width: </span>{{ imgWidth }}</p>
            <p><span class="font-bold capitalize">original height: </span>{{ imgHeight }}</p>
        </div>
        <div class="actions flex justify-end space-x-2 mt-6">
            <IconButton @click="$emit('removeImageBox', imageBox.id)">
                <TrashIcon class="size-6 text-black" />
            </IconButton>
            <IconButton @click="download">
                <FolderArrowDownIcon class="size-6 text-black" />
            </IconButton>
        </div>
    </li>
</template>
<style lang="scss">
    li {
        .cropper-container.cropper-bg {
            width: 100%!important;
        }
    }
</style>