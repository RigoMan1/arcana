import { useDndStore } from './dndStore'; // Adjust the path as necessary

export function useDrag(target: Ref<HTMLElement | null>, data: any) {
  const {
    setDragging,
    setDragData,
    setActiveDropContainerId,
    dropContainerRects,
    $state,
  } = useDndStore();

  function checkOverlap(event: MouseEvent) {
    const { clientX, clientY } = event;

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

  function startDrag(event: MouseEvent | TouchEvent) {
    event.preventDefault();

    setDragging(true);
    setDragData(data);

    document.addEventListener('mousemove', checkOverlap);
  }

  // ! this won't get called unless mouse pointer is over a draggable element
  function endDrag(event: MouseEvent | TouchEvent) {
    event.preventDefault();
    setDragging(false); // this will trigger onDrop

    document.removeEventListener('mousemove', checkOverlap);
  }

  onMounted(() => {
    if (target.value) {
      target.value.addEventListener('mousedown', startDrag);
      target.value.addEventListener('mouseup', endDrag);
    }
  });

  onUnmounted(() => {
    if (target.value) {
      target.value.removeEventListener('mousedown', startDrag);
      target.value.removeEventListener('mouseup', endDrag);
    }
  });

  return {
    dndState: $state,
  };
}
