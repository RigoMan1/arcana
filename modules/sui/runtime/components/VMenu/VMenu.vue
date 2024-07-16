<script setup lang="ts">
// Components
import VOverlay from '../../components-overlay/VOverlay/VOverlay.vue';

// Composables
import { forwardRefs } from '../../composables/forwardRefs';
import { useProxiedModel } from '../../composables/proxiedModel';
import { useScopeId } from '../../composables/scopeId';
import { makeVMenuProps } from './VMenuMeta';

// Utilities
import {
  computed,
  inject,
  mergeProps,
  nextTick,
  provide,
  ref,
  shallowRef,
  watch,
} from 'vue';
import { VMenuSymbol } from './shared';
import {
  focusableChildren,
  focusChild,
  getNextElement,
  getUid,
  isClickInsideElement,
} from '../../util';

// Types
import type { Component } from 'vue';

defineOptions({ name: 'VMenu' });
const props = defineProps(makeVMenuProps());
defineEmits<{ 'update:modelValue': [boolean] }>();

const isActive = useProxiedModel(props, 'modelValue');
const { scopeId } = useScopeId();

const uid = getUid();
const id = computed(() => props.id || `v-menu-${uid}`);

const overlay = ref<InstanceType<typeof VOverlay>>();

const parent = inject(VMenuSymbol, null);
const openChildren = shallowRef(0);
provide(VMenuSymbol, {
  register() {
    ++openChildren.value;
  },
  unregister() {
    --openChildren.value;
  },
  closeParents(e) {
    setTimeout(() => {
      if (
        !openChildren.value &&
        !props.persistent &&
        (e == null ||
          (e && !isClickInsideElement(e, overlay.value!.contentEl!)))
      ) {
        isActive.value = false;
        parent?.closeParents();
      }
    }, 40);
  },
});

async function onFocusIn(e: FocusEvent) {
  const before = e.relatedTarget as HTMLElement | null;
  const after = e.target as HTMLElement | null;

  await nextTick();

  if (
    isActive.value &&
    before !== after &&
    overlay.value?.contentEl &&
    // We're the topmost menu
    overlay.value?.globalTop &&
    // It isn't the document or the menu body
    ![document, overlay.value.contentEl].includes(after!) &&
    // It isn't inside the menu body
    !overlay.value.contentEl.contains(after)
  ) {
    const focusable = focusableChildren(overlay.value.contentEl);
    focusable[0]?.focus();
  }
}

watch(isActive, (val) => {
  if (val) {
    parent?.register();
    document.addEventListener('focusin', onFocusIn, { once: true });
  } else {
    parent?.unregister();
    document.removeEventListener('focusin', onFocusIn);
  }
});

function onClickOutside(e: MouseEvent) {
  parent?.closeParents(e);
}

function onKeydown(e: KeyboardEvent) {
  if (props.disabled) return;

  if (e.key === 'Tab' || (e.key === 'Enter' && !props.closeOnContentClick)) {
    if (
      e.key === 'Enter' &&
      (e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLInputElement && !!e.target.closest('form')))
    )
      return;
    if (e.key === 'Enter') e.preventDefault();

    const nextElement = getNextElement(
      focusableChildren(overlay.value?.contentEl as Element, false),
      e.shiftKey ? 'prev' : 'next',
      (el: HTMLElement) => el.tabIndex >= 0
    );
    if (!nextElement) {
      isActive.value = false;
      overlay.value?.activatorEl?.focus();
    }
  } else if (['Enter', ' '].includes(e.key) && props.closeOnContentClick) {
    isActive.value = false;
    parent?.closeParents();
  }
}

function onActivatorKeydown(e: KeyboardEvent) {
  if (props.disabled) return;

  const el = overlay.value?.contentEl;
  if (el && isActive.value) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      focusChild(el, 'next');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      focusChild(el, 'prev');
    }
  } else if (['ArrowDown', 'ArrowUp'].includes(e.key)) {
    isActive.value = true;
    e.preventDefault();
    setTimeout(() => setTimeout(() => onActivatorKeydown(e)));
  }
}

const activatorProps = computed(() =>
  mergeProps(
    {
      'aria-haspopup': 'menu',
      'aria-expanded': String(isActive.value),
      'aria-owns': id.value,
      onKeydown: onActivatorKeydown,
    },
    props.activatorProps
  )
);

const { modelValue, activatorProps: _activatorProps, ...overlayProps } = props;

forwardRefs({ id, ΨopenChildren: openChildren }, overlay);
</script>

<template>
  <v-overlay
    v-model="isActive"
    ref="overlay"
    :id="id"
    class="v-menu"
    absolute
    :activator-props="activatorProps"
    @click:outside="onClickOutside"
    @keydown="onKeydown"
    v-bind="{
      ...scopeId,
      ...overlayProps,
    }"
  >
    <template #activator="slotProps">
      <slot
        name="activator"
        v-bind="slotProps"
      />
    </template>
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </v-overlay>
</template>
