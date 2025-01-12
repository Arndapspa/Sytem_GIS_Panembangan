<template>
    <div>
        <div style="position: relative">
            <i class="mdi mdi-magnify m-0" style="position: absolute; bottom: 2px; left: 10px; font-size: 1.5rem;"></i>
            <input type="text" class="form-control custom-rounded mb-2" style="padding-left: 2.5rem !important" :placeholder="placeholder" :value="modelValue" @input="handleInput"/>
            <i class="mdi mdi-close m-0" style="position: absolute; bottom: 3px; right: 10px; font-size: 1.5rem; cursor: pointer;" @click="clearValue" v-if="modelValue"></i>
        </div>
        <div class="shadow-lg custom-rounded-medium border bg-white p-0 list-autocomplete" v-if="isOpen && modelValue">
            <ul class="m-0 list-unstyled px-0" v-if="searchResults.length">
                <li
                    v-for="result in searchResults"
                    :key="result.name"
                    @click="onSelected(result)"
                    class="p-3 autocomplete-item"
                    :class="{'border-bottom': searchResults.legth}"
                    style="cursor: pointer">
                    {{ result.name }}
                </li>
            </ul>
            <div v-if="!searchResults.length && modelValue" class="p-3">Tidak ada</div>
        </div>
    </div>
</template>
<script setup>
import { computed, ref } from 'vue'

    const props = defineProps({
        source: {
            type: Array,
            required: true,
            default: () => []
        },
        modelValue: String,
        placeholder: String
    })

    const emit = defineEmits(['update:modelValue', 'onSelectedAutocomplete'])

    const search = ref('')

    const isOpen = ref(false)

    const searchResults = computed(() => {
        if (search.value === '') {
            return []
        }

        return props.source.filter(item => {
            if (item.name.toLowerCase().includes(search.value.toLowerCase())) {
                return item
            }
        })
    })

    const onSelected = item => {
        isOpen.value = false
        search.value = item.name
        emit('update:modelValue', search.value)
        emit('onSelectedAutocomplete', item)
    }

    const handleInput = event => {
        isOpen.value = true
        search.value = event.target.value
        emit('update:modelValue', search.value)
    }

    const clearValue = event => {
        isOpen.value = false
        search.value = ''
        emit('update:modelValue', '')
    }
</script>