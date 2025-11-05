<template>
  <div class="relative">
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium text-gray-700 mb-1"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div class="relative">
      <input
        :id="id"
        v-model="modelValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :autocomplete="autocomplete"
        :class="inputClasses"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      
      <!-- Icon -->
      <div
        v-if="icon"
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <component
          :is="icon"
          class="h-5 w-5 text-gray-400"
        />
      </div>
      
      <!-- Error icon -->
      <div
        v-if="hasError"
        class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
      >
        <svg
          class="h-5 w-5 text-red-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </div>
    
    <!-- Help text -->
    <p
      v-if="helpText && !hasError"
      class="mt-1 text-sm text-gray-500"
    >
      {{ helpText }}
    </p>
    
    <!-- Error message -->
    <p
      v-if="hasError"
      class="mt-1 text-sm text-red-600"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup>
import { computed, useId } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text',
    validator: (value) => [
      'text', 'email', 'password', 'number', 'tel', 'url', 'search'
    ].includes(value)
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  helpText: {
    type: String,
    default: ''
  },
  errorMessage: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  autocomplete: {
    type: String,
    default: ''
  },
  icon: {
    type: [String, Object],
    default: null
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue', 'input', 'blur', 'focus'])

const id = useId()

const hasError = computed(() => !!props.errorMessage)

const inputClasses = computed(() => {
  const baseClasses = [
    'block',
    'w-full',
    'border',
    'rounded-md',
    'shadow-sm',
    'focus:outline-none',
    'focus:ring-1',
    'transition-colors',
    'duration-200'
  ]
  
  // Size classes
  const sizeClasses = {
    sm: ['px-3', 'py-1.5', 'text-sm'],
    md: ['px-3', 'py-2', 'text-sm'],
    lg: ['px-4', 'py-3', 'text-base']
  }
  
  // State classes
  let stateClasses = []
  
  if (hasError.value) {
    stateClasses = [
      'border-red-300',
      'text-red-900',
      'placeholder-red-300',
      'focus:ring-red-500',
      'focus:border-red-500'
    ]
  } else if (props.disabled) {
    stateClasses = [
      'border-gray-300',
      'bg-gray-50',
      'text-gray-500',
      'cursor-not-allowed'
    ]
  } else if (props.readonly) {
    stateClasses = [
      'border-gray-300',
      'bg-gray-50',
      'text-gray-700'
    ]
  } else {
    stateClasses = [
      'border-gray-300',
      'text-gray-900',
      'placeholder-gray-400',
      'focus:ring-primary-500',
      'focus:border-primary-500'
    ]
  }
  
  // Icon padding
  const iconPadding = props.icon ? 'pl-10' : ''
  const errorPadding = hasError.value ? 'pr-10' : ''
  
  return [
    ...baseClasses,
    ...sizeClasses[props.size],
    ...stateClasses,
    iconPadding,
    errorPadding
  ].join(' ')
})

const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
  emit('input', event)
}

const handleBlur = (event) => {
  emit('blur', event)
}

const handleFocus = (event) => {
  emit('focus', event)
}
</script>