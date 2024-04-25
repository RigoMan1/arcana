import { canUseDOM } from '../../utils/dnd-utils';

export function useDragEvents(
  targetRef: { value: HTMLElement | null },
  onDragStart: (event: MouseEvent | TouchEvent) => void,
  onDragMove: (event: MouseEvent | TouchEvent) => void,
  onDragEnd: () => void
) {
  const attachEvents = () => {
    if (canUseDOM && targetRef.value) {
      targetRef.value.addEventListener('mousedown', onDragStart);
      targetRef.value.addEventListener('touchstart', onDragStart, {
        passive: false,
      });
      window.addEventListener('mousemove', onDragMove);
      window.addEventListener('touchmove', onDragMove, { passive: false });
      window.addEventListener('mouseup', onDragEnd);
      window.addEventListener('touchend', onDragEnd);
    }
  };

  const detachEvents = () => {
    if (canUseDOM && targetRef.value) {
      targetRef.value.removeEventListener('mousedown', onDragStart);
      targetRef.value.removeEventListener('touchstart', onDragStart);
      window.removeEventListener('mousemove', onDragMove);
      window.removeEventListener('touchmove', onDragMove);
      window.removeEventListener('mouseup', onDragEnd);
      window.removeEventListener('touchend', onDragEnd);
    }
  };

  return { attachEvents, detachEvents };
}
