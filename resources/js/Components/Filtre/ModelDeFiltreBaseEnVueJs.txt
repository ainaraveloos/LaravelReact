<script setup>

import {Button, Dropdown, Input, Space} from 'ant-design-vue';
import {DownOutlined} from '@ant-design/icons-vue';
import {router} from "@inertiajs/vue3";


defineProps({
    modelValue: {
        type: Object,
        required: true
    },
    show_boxShasow: {
        type: Boolean,
        default: true
    },
    show_filter: {
        type: Boolean,
        default: false
    }
});


const emit = defineEmits(["search", "reset"]);

</script>

<template>
    <div class="filter-container bg-white p-4 rounded-t-md" :class="show_boxShasow ? 'shadow' : ''">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

<!--            <H1 class="text-nowrap text-2xl">Liste vehicule</H1>-->
            <!-- Groupe Recherche + Filtre -->
            <div class="flex items-center  w-full  flex-grow">

                <a-input
                    size="large"
                    v-model:value="modelValue.search"
                    placeholder="Rechercher..."
                    class="group w-full !rounded-r-none !border !border-r-0 focus:z-10 focus:border-r focus:!border-secondary transition-colors"
                    allow-clear
                    @pressEnter="$emit('search', modelValue)"
                >
                    <template #prefix>
                        <font-awesome-icon
                            icon="fa-solid fa-magnifying-glass"
                            class="text-sm group-focus-within:text-secondary text-slate-400 transition-colors duration-300"
                        />
                    </template>
                </a-input>

                <!-- Filtres supplémentaires -->
                <slot name="otherFilter"/>

                <!-- Boutons de recherche -->
                <a-button
                    size="large"
                    @click="$emit('reset', modelValue)"
                    type="default"
                    class="group/reset !rounded-none border-r-0 focus:z-10 hover:!border-secondary hover:!border-r hover:!bg-secondary/5 !bg-white/80 backdrop-blur-sm !shadow-sm hover:!shadow-md transition-all duration-300 overflow-hidden relative"
                >
                    <font-awesome-icon
                        class="cursor-pointer text-slate-600 group-hover/reset:text-secondary group-hover/reset:rotate-180 transition-all duration-500"
                        icon="fa-solid fa-refresh"
                    />
                </a-button>
                <a-button
                    size="large"
                    @click="$emit('search', modelValue)"
                    type="default"
                    class="group/reset !rounded-l-none focus:z-10 hover:!border-secondary hover:!bg-secondary/5 !bg-white/80 backdrop-blur-sm !shadow-sm hover:!shadow-md transition-all duration-300"
                    :class="!$slots.import ? '' : '!rounded-r-none'"

                >
                    <span class="i-fa6-solid-magnifying-glass"></span>
                    Rechercher
                </a-button>
                <slot name="import"/>
            </div>

            <!-- Bouton Ajouter -->
            <div class="w-full sm:w-auto">
                <!-- Slot pour bouton ajouter -->
                <div class="ml-4 w-full">
                    <slot name="add"/>
                </div>
            </div>
        </div>
    </div>
</template>
