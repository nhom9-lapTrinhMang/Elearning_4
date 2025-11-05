<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <!-- Background overlay -->
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <transition
        enter-active-class="ease-out duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="ease-in duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="show"
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          @click="handleBackdropClick"
        ></div>
      </transition>

      <!-- This element is to trick the browser into centering the modal contents. -->
      <span
        class="hidden sm:inline-block sm:align-middle sm:h-screen"
        aria-hidden="true"
      >&#8203;</span>

      <transition
        enter-active-class="ease-out duration-300"
        enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        enter-to-class="opacity-100 translate-y-0 sm:scale-100"
        leave-active-class="ease-in duration-200"
        leave-from-class="opacity-100 translate-y-0 sm:scale-100"
        leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      >
        <div
          v-if="show"
          :class="modalClasses"
        >
          <!-- Header -->
          <div
            v-if="showHeader"
            class="flex items-center justify-between p-6 border-b border-gray-200"
          >
            <h3
              id="modal-title"
              class="text-lg font-medium text-gray-900"
            >
              <slot name="title">{{ title }}</slot>
            </h3>
            
            <button
              v-if="closable"
              type="button"
              class="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition-colors duration-200"
              @click="close"
            >
              <span class="sr-only">Close</span>
              <svg
                class="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div :class="bodyClasses">
            <slot></slot>
          </div>

          <!-- Footer -->
          <div
            v-if="showFooter"
            class="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50"
          >
            <slot name="footer">
              <Button
                v-if="cancelText"
                variant="outline"
                @click="cancel"
              >
                {{ cancelText }}
              </Button>
              
              <Button
                v-if="confirmText"
                :variant="confirmVariant"
                :loading="loading"
                @click="confirm"
              >
                {{ confirmText }}
              </Button>
            </slot>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, nextTick } from 'vue'
import Button from './Button.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl', 'full'].includes(value)
  },
  closable: {
    type: Boolean,
    default: true
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true
  },
  showHeader: {
    type: Boolean,
    default: true
  },
  showFooter: {
    type: Boolean,
    default: false
  },
  cancelText: {
    type: String,
    default: ''
  },
  confirmText: {
    type: String,
    default: ''
  },
  confirmVariant: {
    type: String,
    default: 'primary'
  },
  loading: {
    type: Boolean,
    default: false
  },
  persistent: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'cancel', 'confirm', 'update:show'])

const modalClasses = computed(() => {
  const baseClasses = [
    'inline-block',
    'align-bottom',
    'bg-white',
    'rounded-lg',
    'text-left',
    'overflow-hidden',
    'shadow-xl',
    'transform',
    'transition-all',
    'sm:my-8',
    'sm:align-middle',
    'w-full'
  ]
  
  const sizeClasses = {
    xs: ['sm:max-w-xs'],
    sm: ['sm:max-w-sm'],
    md: ['sm:max-w-md'],
    lg: ['sm:max-w-lg'],
    xl: ['sm:max-w-xl'],
    full: ['sm:max-w-full', 'sm:mx-4']
  }
  
  return [
    ...baseClasses,
    ...sizeClasses[props.size]
  ].join(' ')
})

const bodyClasses = computed(() => {
  const baseClasses = ['p-6']
  
  if (!props.showHeader) {
    baseClasses.push('pt-6')
  }
  
  if (!props.showFooter) {
    baseClasses.push('pb-6')
  }
  
  return baseClasses.join(' ')
})

const close = () => {
  if (!props.persistent) {
    emit('update:show', false)
    emit('close')
  }
}

const cancel = () => {
  emit('cancel')
  close()
}

const confirm = () => {
  emit('confirm')
}

const handleBackdropClick = () => {
  if (props.closeOnBackdrop && props.closable) {
    close()
  }
}

// Handle escape key
const handleEscape = (event) => {
  if (event.key === 'Escape' && props.show && props.closable) {
    close()
  }
}

// Body scroll lock
const lockBodyScroll = () => {
  document.body.style.overflow = 'hidden'
}

const unlockBodyScroll = () => {
  document.body.style.overflow = ''
}

watch(() => props.show, async (newValue) => {
  if (newValue) {
    await nextTick()
    lockBodyScroll()
    document.addEventListener('keydown', handleEscape)
  } else {
    unlockBodyScroll()
    document.removeEventListener('keydown', handleEscape)
  }
})

// Cleanup on unmount
import { onUnmounted } from 'vue'
onUnmounted(() => {
  unlockBodyScroll()
  document.removeEventListener('keydown', handleEscape)
})
</script>