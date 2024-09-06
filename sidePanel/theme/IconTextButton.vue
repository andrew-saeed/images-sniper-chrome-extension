<template>
    <button class="w-full bg-white text-black text-[1rem] leading-none capitalize flex items-center justify-center px-4 py-2 rounded-xl [&[disabled]]:opacity-80 [&:not([disabled]):hover]:bg-slate-300">
        <div class="mr-3">
            <slot name="icon" />
        </div>
        <div>
            <slot name="text" />
        </div>
    </button>
</template>