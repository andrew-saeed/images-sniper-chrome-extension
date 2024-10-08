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

    const getImageName = (length = 10) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        let result = ''
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length))
        }
        return `${result}.jpeg`
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
        cropperRef.value = new Cropper(imgRef.value, {
            responsive: false,
        })
        imgRef.value.addEventListener('ready', () => {
            imgWidth.value = `${imgRef.value.naturalWidth}px`
            imgHeight.value = `${imgRef.value.naturalHeight}px`
        })
        emit('addImageCropper', {
            id: props.imageBox.id,
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