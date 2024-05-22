import type { Ref } from 'vue';
import type { Coordinates } from '../../utils/dnd-utils';
import { ref, onMounted, onUnmounted } from 'vue';
import { getEventCoordinates } from '../../utils/dnd-utils';
import { useDragEvents } from './useDragEvents';

export function useDraggableEl(targetRef: Ref<HTMLElement | null>) {
  const initialPosition: Ref<Coordinates> = ref({ x: 0, y: 0 }); // Track initial coordinates
  const position: Ref<Coordinates> = ref({ x: 0, y: 0 });
  const rotation: Ref<Coordinates> = ref({ x: 0, y: 0 });
  const delta: Ref<Coordinates> = ref({ x: 0, y: 0 });
  const isDragging = ref(false);

  function updatePosition(x: number, y: number) {
    if (!targetRef.value) return;

    const newX = x - delta.value.x;
    const newY = y - delta.value.y;

    position.value = { x: newX, y: newY };
  }

  function resetPosition() {
    position.value = { ...initialPosition.value };
  }

  // 1️⃣
  function onDragStart(event: MouseEvent | TouchEvent) {
    if (!targetRef.value) return;
    isDragging.value = true;

    const rect = targetRef.value.getBoundingClientRect();
    const { x: clientX, y: clientY } = getEventCoordinates(
      event
    ) as Coordinates;

    const offsetX = clientX - rect.left;
    const offsetY = clientY - rect.top;

    delta.value = { x: offsetX, y: offsetY };

    updatePosition(clientX, clientY);
  }

  // 2️⃣
  function onDragMove(event: MouseEvent | TouchEvent) {
    if (!isDragging.value || !targetRef.value) return;

    const { x: clientX, y: clientY } = getEventCoordinates(
      event
    ) as Coordinates;
    updatePosition(clientX, clientY);
  }

  // 3️⃣
  function onDragEnd() {
    isDragging.value = false;
    delta.value = { x: 0, y: 0 };

    resetPosition();
  }

  const { attachEvents, detachEvents } = useDragEvents(
    targetRef,
    onDragStart,
    onDragMove,
    onDragEnd
  );

  onMounted(attachEvents);
  onUnmounted(detachEvents);

  const style = computed(
    () =>
      `transform: translate(${position.value.x}px, ${position.value.y}px) rotateX(${rotation.value.x}deg) rotateY(${rotation.value.y}deg)`
  );

  return {
    isDragging,
    position,
    resetPosition,
    positionData: {
      initialPosition,
      delta,
      position,
    },
    style,
  };
}
