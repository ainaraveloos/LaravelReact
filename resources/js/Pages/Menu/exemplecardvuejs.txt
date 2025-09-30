<template>
<div class=" group relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 text-white shadow-sm transition-all duration-500 ease-in-out hover:shadow-md md:p-10"
:style="{background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,}"
>
    <div v-if="icon"
    class="absolute right-6 top-1/2 -translate-y-1/2 text-white/25 opacity-70 transition-all duration-500 ease-in-out group-hover:scale-[1.75]"
    >
        <font-awesome-icon :icon="icon" class=" h-auto  xl:w-full w-3/4 md:block hidden"/>
    </div>

    <div class="relative z-10 flex h-full flex-col justify-between">
        <header v-if="title">
            <h3 class="mb-2 text-base font-bold uppercase tracking-widest text-white/80" > {{ title }}</h3>
        </header>

        <section class="my-4">
            <div class="flex items-baseline gap-2">
                <span class="text-4xl font-semibold tracking-tight drop-shadow-lg md:text-6xl" >{{ value }}</span>
                <span v-if="suffix" class="text-xl font-medium text-white/90"> {{ suffix }} </span>
            </div>
        </section>

        <footer v-if="details.length" class="mt-auto ">
            <div class="grid grid-cols-2 gap-4 text-sm md:grid-cols-2 md:gap-6">
                <div v-for="(detail, i) in details" :key="i" class="flex flex-col items-center rounded-lg bg-white/10 p-2 md:p-3">
                    <span class="mb-1 text-sm uppercase text-white/70">{{ detail.label }}</span>
                    <span class="text-xl font-extrabold text-white">{{ detail.value }}</span>
                </div>
            </div>
        </footer>
    </div>
</div>
</template>

<script setup>
const props = defineProps({
    title: { type: String, default: "Statistiques" },
    value: { type: [String, Number], default: 0 },
    suffix: { type: String, default: "" },
    details: { type: Array, default: () => [] },
    gradientFrom: { type: String, default: "#f59e0b" },
    gradientTo: { type: String, default: "#f97316" },
    icon: { type: String, default: "fa-solid fa-chart-line" },
    animate: { type: Boolean, default: true }
});
</script>
