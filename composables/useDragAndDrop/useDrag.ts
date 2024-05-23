import { useDndStore } from './dndStore'; // Adjust the path as necessary
import { getEventCoordinates, type Coordinates } from '../../utils/dnd-utils';

export function useDrag(target: Ref<HTMLElement | null>, data: any) {
  const {
    setDragging,
    setDragData,
    setActiveDropContainerId,
    dropContainerRects,
    $state,
  } = useDndStore();

  function checkOverlap(event: MouseEvent | TouchEvent) {
    const { x: clientX, y: clientY } = getEventCoordinates(
      event
    ) as Coordinates;

    // let isOverAnyContainer = false;
    let overContainerId = null;

    dropContainerRects.forEach((data, id) => {
      const { rect } = data;
      // const threshold = 0.5;
      const threshold = 0.1;
      const thresholdX = rect.width * threshold;
      const thresholdY = rect.height * threshold;
      if (
        clientX >= rect.left - thresholdX &&
        clientX <= rect.right + thresholdX &&
        clientY >= rect.top - thresholdY &&
        clientY <= rect.bottom + thresholdY
      ) {
        // isOverAnyContainer = true;
        overContainerId = id;

        return;
      }
    });

    setActiveDropContainerId(overContainerId);
  }

  function startDrag() {
    setDragging(true);
    setDragData(data);

    document.addEventListener('touchmove', checkOverlap);
    document.addEventListener('touchend', endDrag, { once: true });

    document.addEventListener('mousemove', checkOverlap);
    document.addEventListener('mouseup', endDrag, { once: true });
  }

  // ! this won't get called unless mouse pointer is over a draggable element
  function endDrag() {
    setDragging(false); // this will trigger onDrop

    document.removeEventListener('touchmove', checkOverlap);

    document.removeEventListener('mousemove', checkOverlap);
  }

  onMounted(() => {
    if (target.value) {
      target.value.addEventListener('touchstart', startDrag, {
        passive: true,
      });

      target.value.addEventListener('mousedown', startDrag);
    }
  });

  onUnmounted(() => {
    if (target.value) {
      target.value.removeEventListener('touchstart', startDrag);

      target.value.removeEventListener('mousedown', startDrag);
    }
  });

  return {
    dndState: $state,
  };
}
