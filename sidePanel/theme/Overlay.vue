<script setup>
    import { ref, onMounted } from 'vue'
    import { ExclamationTriangleIcon, Cog8ToothIcon } from '@heroicons/vue/24/solid'
    import Button from './Button.vue'

    const toggle = ref(false)
    const reqAction = ref('')

    onMounted(() => {
        chrome.runtime.onMessage.addListener(async (request, sender, reply) => {
            reqAction.value = request.action

            if(reqAction.value === 'fetch_start') toggle.value = true
            else if(reqAction.value === 'img_shoot') toggle.value = false
        })
    })
</script>
<template>
    <div v-show="toggle" class="fixed top-0 left-0 z-10 w-full h-svh bg-black/90 flex justify-center items-center">
        <div v-if="reqAction === 'fetch_start'" class="flex">
            <Cog8ToothIcon class="w-[2rem] h-[2rem] animate-spin" />
            <div class="text-2xl font-bold capitalize px-2">working ...</div>
        </div>
        <div v-else-if="reqAction === 'img_shoot_error'" class="p-2">
            <div class="flex">
                <ExclamationTriangleIcon class="w-[2rem] h-[2rem] mr-2" />
                <div>
                    <p class="text-xl font-bold capitalize">this website doesn't support CORS!</p>
                    <p class="text-base first-letter:capitalize mt-4">open the image in a new window and try to snipe again.</p>
                </div>
            </div>
            <div class="mt-4">
                <Button @click="toggle = false"><span class="font-bold">ok</span></Button>
            </div>
        </div>
    </div>
</template>