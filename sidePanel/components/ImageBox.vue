<script setup>
    import Cropper from 'cropperjs'
    import { onMounted, ref } from 'vue'
    import { TrashIcon, FolderArrowDownIcon } from '@heroicons/vue/24/solid'
    import IconButton from '../theme/IconButton.vue'

    const props = defineProps(['imageBox'])
    const emit = defineEmits(['addImageCropper', 'removeImageBox'])

    const imgRef = ref(null)
    const imgWidth = ref('')
    const imgHeight = ref('')
    const cropperRef = ref(null)

    const getImageName = () => {
        const imageUrl = new URL(props.imageBox.src)
        const segments = imageUrl.pathname.split('/')
        const fileName = segments[segments.length - 1]

        return fileName
    }

    const download = () => {
        cropperRef.value.getCroppedCanvas().toBlob(async (blob) => {

            // download the canvas-image blob
            const saveFileHandle = await window.showSaveFilePicker({
                suggestedName: getImageName(),
                types: [{
                    description: 'Image',
                    accept: {'image/*': ['.png', '.jpg', '.jpeg']}
                }],
            })
            const writable = await saveFileHandle.createWritable()
            await writable.write(blob)
            await writable.close()
        })
    }

    onMounted(() => {
        const id = `${Date.now()}-${Math.floor(Math.random() * 1000)}`
        cropperRef.value = new Cropper(imgRef.value, {
            aspectRatio: 16 / 9,
            responsive: false,
        })
        imgRef.value.addEventListener('ready', () => {
            imgWidth.value = `${imgRef.value.naturalWidth}px`
            imgHeight.value = `${imgRef.value.naturalHeight}px`
        })
        emit('addImageCropper', {
            id, 
            cropperIns: cropperRef.value,
            imageName: getImageName()
        })
    })
</script>
<template>
    <li>
        <img class="w-full" ref="imgRef" :src="imageBox.src" alt="sniper image">
        <div class="text-[1rem] mt-3">
            <p><span class="font-bold capitalize">original width: </span>{{ imgWidth }}</p>
            <p><span class="font-bold capitalize">original height: </span>{{ imgHeight }}</p>
        </div>
        <div class="actions flex justify-end space-x-2 mt-3">
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