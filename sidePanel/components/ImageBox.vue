<script setup>
    import Cropper from 'cropperjs'
    import { onMounted, ref } from 'vue'

    const props = defineProps(['imageBox'])

    const imgRef = ref(null)
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
    })
</script>
<template>
    <li>
        <img ref="imgRef" :src="imageBox.src" alt="sniper image">
        <div>
            <button @click="$emit('removeImageBox', imageBox.id)">delete</button>
            <button @click="download">download</button>
        </div>
    </li>
</template>
<style lang="scss">
    img {
        width: 100%;
    }
    .cropper-container.cropper-bg {
        width: 100%!important;
    }
</style>