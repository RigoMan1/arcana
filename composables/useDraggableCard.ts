// import { useEventListener } from '../useEventListener'
import { computed, ref } from 'vue-demi';
import type { MaybeRefOrGetter, PointerType, Position } from '@vueuse/core';
import { isClient, toRefs, toValue, defaultWindow } from '@vueuse/core';

interface Vec2D {
  x: number;
  y: number;
}

export interface UseDraggableOptions {
  /**
   * Only start the dragging when click on the element directly
   *
   * @default false
   */
  exact?: MaybeRefOrGetter<boolean>;

  /**
   * Prevent events defaults
   *
   * @default false
   */
  preventDefault?: MaybeRefOrGetter<boolean>;

  /**
   * Prevent events propagation
   *
   * @default false
   */
  stopPropagation?: MaybeRefOrGetter<boolean>;

  /**
   * Whether dispatch events in capturing phase
   *
   * @default true
   */
  capture?: boolean;

  /**
   * Element to attach `pointermove` and `pointerup` events to.
   *
   * @default window
   */
  draggingElement?: MaybeRefOrGetter<
    HTMLElement | SVGElement | Window | Document | null | undefined
  >;

  /**
   * Element for calculating bounds (If not set, it will use the event's target).
   *
   * @default undefined
   */
  containerElement?: MaybeRefOrGetter<
    HTMLElement | SVGElement | null | undefined
  >;

  /**
   * Handle that triggers the drag event
   *
   * @default target
   */
  handle?: MaybeRefOrGetter<HTMLElement | SVGElement | null | undefined>;

  /**
   * Pointer types that listen to.
   *
   * @default ['mouse', 'touch', 'pen']
   */
  pointerTypes?: PointerType[];

  /**
   * Initial position of the element.
   *
   * @default { x: 0, y: 0 }
   */
  initialValue?: MaybeRefOrGetter<Position>;

  /**
   * Callback when the dragging starts. Return `false` to prevent dragging.
   */
  onStart?: (position: Position, event: PointerEvent) => void | false;

  /**
   * Callback during dragging.
   */
  onMove?: (position: Position, event: PointerEvent) => void;

  /**
   * Callback when dragging end.
   */
  onEnd?: (position: Position, event: PointerEvent) => void;

  /**
   * Axis to drag on.
   *
   * @default 'both'
   */
  axis?: 'x' | 'y' | 'both';
}

/**
 * Make elements draggable.
 *
 * @see https://vueuse.org/useDraggable
 * @param target
 * @param options
 */
export function useDraggableCard(
  target: MaybeRefOrGetter<HTMLElement | SVGElement | null | undefined>,
  options: UseDraggableOptions = {}
) {
  const {
    pointerTypes,
    preventDefault,
    stopPropagation,
    exact,
    onMove,
    onEnd,
    onStart,
    initialValue,
    axis = 'both',
    draggingElement = defaultWindow,
    containerElement,
    handle: draggingHandle = target,
  } = options;

  const position = ref<Position>(toValue(initialValue) ?? { x: 0, y: 0 });
  const targetPosition = ref<Position>({ x: 0, y: 0 });
  const pressedDelta = ref<Position>(); // pin / anchor

  const rotation = ref<Vec2D>({ x: 0, y: 0 });
  const targetRotation = ref<Vec2D>({ x: 0, y: 0 });

  const rotationSpeed = 0.1;
  const positionAlpha = 0.1;
  let easingFactor = 0.1; // New: Easing factor for more realism

  let animationFrameId: number | null = null;

  // Function to stop the animation
  const stopAnimation = () => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  };

  // Lerping function
  const lerpPositionAndRotation = () => {
    const positionAlpha = 0.1; // Speed of position lerping
    let { x, y } = position.value;
    x += (targetPosition.value.x - x) * positionAlpha;
    y += (targetPosition.value.y - y) * positionAlpha;

    position.value = { x, y }; // Update the actual position

    // New: Lerp rotation
    const { x: rx, y: ry } = rotation.value;
    const { x: tx, y: ty } = targetRotation.value;
    rotation.value = {
      x: rx + (tx - rx) * rotationSpeed,
      y: ry + (ty - ry) * rotationSpeed,
    };

    // Continue the animation if the target is not yet reached
    if (
      Math.abs(targetPosition.value.x - x) > 0.1 ||
      Math.abs(targetPosition.value.y - y) > 0.1 ||
      // Check if rotation also reached the target
      Math.abs(targetRotation.value.x - rx) > 0.1 ||
      Math.abs(targetRotation.value.y - ry) > 0.1
    ) {
      animationFrameId = requestAnimationFrame(lerpPositionAndRotation);
    } else {
      stopAnimation(); // Stop the animation if the target is close enough
    }
  };

  const filterEvent = (e: PointerEvent) => {
    if (pointerTypes)
      return pointerTypes.includes(e.pointerType as PointerType);
    return true;
  };

  const handleEvent = (e: PointerEvent) => {
    if (toValue(preventDefault)) e.preventDefault();
    if (toValue(stopPropagation)) e.stopPropagation();
  };

  const start = (e: PointerEvent) => {
    if (!filterEvent(e)) return;
    if (toValue(exact) && e.target !== toValue(target)) return;

    handleEvent(e); // Handle the event early to prevent any defaults that might interfere.

    const targetEl = toValue(target);
    if (!targetEl) return; // Ensure there's a target element to work with.

    const rect = targetEl.getBoundingClientRect(); // Get bounding rectangle of target.

    // Set the pressedDelta to where the click occurred within the element
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    pressedDelta.value = { x: offsetX, y: offsetY };

    // Adjust targetPosition to move with the cursor from the start
    targetPosition.value = { x: e.clientX - offsetX, y: e.clientY - offsetY };

    // Optionally, set an initial rotation based on the click position for a dynamic effect
    // Adjust or remove this part based on your specific needs
    targetRotation.value = { x: 0, y: 0 }; // Example static value, adjust as needed

    // Immediately apply the calculated position and rotation
    position.value = { ...targetPosition.value };
    rotation.value = { ...targetRotation.value };

    if (onStart?.(position.value, e) === false) return;

    // Ensure the animation loop is running to apply these initial values
    if (animationFrameId === null) lerpPositionAndRotation();
  };

  const move = (e: PointerEvent) => {
    if (!filterEvent(e)) return;
    if (!pressedDelta.value) return;

    // initial position
    const container = toValue(containerElement);
    const containerRect = container?.getBoundingClientRect?.();
    const targetRect = toValue(target)!.getBoundingClientRect();
    let { x, y } = position.value;
    if (axis === 'x' || axis === 'both') {
      x = e.clientX - pressedDelta.value.x;
      if (container)
        x = Math.min(
          Math.max(0, x),
          containerRect!.width + container.scrollLeft - targetRect!.width
        );
    }
    if (axis === 'y' || axis === 'both') {
      y = e.clientY - pressedDelta.value.y;
      if (container)
        y = Math.min(
          Math.max(0, y),
          containerRect!.height + container.scrollTop - targetRect!.height
        );
    }
    // target position
    targetPosition.value = { x, y };

    // target rotation
    let diffX = targetPosition.value.x - position.value.x;
    let diffY = targetPosition.value.y - position.value.y;

    const sensitivity = 3;
    let newTargetRx = diffY * sensitivity;
    let newTargetRy = diffX * sensitivity;

    // Clamp the rotation values
    const clampAmount = 30;
    newTargetRx = Math.min(Math.max(newTargetRx, -clampAmount), clampAmount);
    newTargetRy = Math.min(Math.max(newTargetRy, -clampAmount), clampAmount);

    targetRotation.value = { x: newTargetRx, y: newTargetRy };

    if (animationFrameId === null) lerpPositionAndRotation();

    onMove?.(position.value, e);
    handleEvent(e);
  };

  const end = (e: PointerEvent) => {
    if (!filterEvent(e)) return;
    if (!pressedDelta.value) return;
    pressedDelta.value = undefined;
    onEnd?.(position.value, e);
    handleEvent(e);
    // stopAnimation();
    targetRotation.value = { x: 0, y: 0 };
  };

  if (isClient) {
    const config = { capture: options.capture ?? true };
    useEventListener(draggingHandle, 'pointerdown', start, config);
    useEventListener(draggingElement, 'pointermove', move, config);
    useEventListener(draggingElement, 'pointerup', end, config);
  }

  function resetCard() {
    targetPosition.value = { x: 0, y: 0 };
    targetRotation.value = { x: 0, y: 0 };
    position.value = { x: 0, y: 0 };
    rotation.value = { x: 0, y: 0 };
  }

  return {
    ...toRefs(position),
    resetCard,
    position,
    isDragging: computed(() => !!pressedDelta.value),
    style: computed(
      // () => `left:${position.value.x}px;top:${position.value.y}px;`
      () =>
        `transform: translate(${position.value.x}px, ${position.value.y}px) rotateX(${rotation.value.x}deg) rotateY(${rotation.value.y}deg)`
    ),
  };
}

export type useDraggableCardReturn = ReturnType<typeof useDraggableCard>;
