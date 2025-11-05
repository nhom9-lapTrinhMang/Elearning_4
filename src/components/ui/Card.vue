<template>
  <div :class="cardClasses">
    <!-- Header -->
    <div
      v-if="showHeader"
      :class="headerClasses"
    >
      <slot name="header">
        <h3
          v-if="title"
          class="text-lg font-medium text-gray-900"
        >
          {{ title }}
        </h3>
      </slot>
    </div>

    <!-- Body -->
    <div :class="bodyClasses">
      <slot></slot>
    </div>

    <!-- Footer -->
    <div
      v-if="showFooter"
      :class="footerClasses"
    >
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'outlined', 'elevated', 'flat'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  padding: {
    type: String,
    default: 'md',
    validator: (value) => ['none', 'sm', 'md', 'lg'].includes(value)
  },
  showHeader: {
    type: Boolean,
    default: false
  },
  showFooter: {
    type: Boolean,
    default: false
  },
  hoverable: {
    type: Boolean,
    default: false
  },
  clickable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const cardClasses = computed(() => {
  const baseClasses = ['overflow-hidden']
  
  // Variant classes
  const variantClasses = {
    default: ['bg-white', 'border', 'border-gray-200', 'rounded-lg'],
    outlined: ['bg-white', 'border-2', 'border-gray-300', 'rounded-lg'],
    elevated: ['bg-white', 'shadow-lg', 'rounded-lg', 'border-0'],
    flat: ['bg-gray-50', 'border-0', 'rounded-lg']
  }
  
  // Hover and click effects
  const interactionClasses = []
  
  if (props.hoverable) {
    interactionClasses.push('hover:shadow-md', 'transition-shadow', 'duration-200')
  }
  
  if (props.clickable) {
    interactionClasses.push('cursor-pointer', 'hover:bg-gray-50', 'transition-colors', 'duration-200')
  }
  
  return [
    ...baseClasses,
    ...variantClasses[props.variant],
    ...interactionClasses
  ].join(' ')
})

const headerClasses = computed(() => {
  const baseClasses = ['border-b', 'border-gray-200', 'bg-gray-50']
  
  const paddingClasses = {
    none: [],
    sm: ['px-4', 'py-3'],
    md: ['px-6', 'py-4'],
    lg: ['px-8', 'py-5']
  }
  
  return [
    ...baseClasses,
    ...paddingClasses[props.padding]
  ].join(' ')
})

const bodyClasses = computed(() => {
  const paddingClasses = {
    none: [],
    sm: ['p-4'],
    md: ['p-6'],
    lg: ['p-8']
  }
  
  return paddingClasses[props.padding].join(' ')
})

const footerClasses = computed(() => {
  const baseClasses = ['border-t', 'border-gray-200', 'bg-gray-50']
  
  const paddingClasses = {
    none: [],
    sm: ['px-4', 'py-3'],
    md: ['px-6', 'py-4'],
    lg: ['px-8', 'py-5']
  }
  
  return [
    ...baseClasses,
    ...paddingClasses[props.padding]
  ].join(' ')
})

const handleClick = (event) => {
  if (props.clickable) {
    emit('click', event)
  }
}
</script>