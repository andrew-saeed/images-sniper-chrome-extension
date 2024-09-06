<script setup>
    import { ref, onMounted } from 'vue'
    import { Cog8ToothIcon } from '@heroicons/vue/24/solid'

    const toggle = ref(false)

    onMounted(() => {
        chrome.runtime.onMessage.addListener(async (request, sender, reply) => {
            if(request.action === "fetch_start") toggle.value = true
            else if(request.action === "img_shoot") toggle.value = false
        })
    })
</script>
<template>
    <div v-show="toggle" class="fixed top-0 left-0 z-10 w-full h-svh bg-black/90 flex justify-center items-center">
        <div class="flex">
            <Cog8ToothIcon class="w-[2rem] h-[2rem] animate-spin" />
            <div class="text-2xl font-bold capitalize px-2">working ...</div>
        </div>
    </div>
</template>