import { defineStore } from 'pinia';

interface DropContainerRect {
  rect: DOMRect;
}

export interface DndState {
  isDragging: boolean;
  dragData: string | null;
  activeDropContainerId: string | null;
  dropContainerRects: Map<string, DropContainerRect>;
  dropContainers: { [key: string]: string[] };
}

export const useDndStore = defineStore('dnd', {
  state: (): DndState => ({
    isDragging: false,
    dragData: null,
    activeDropContainerId: null,
    dropContainerRects: new Map(),
    dropContainers: {},
  }),
  actions: {
    setDragging(isDragging: boolean) {
      this.isDragging = isDragging;
    },
    setDragData(dragData: any = null) {
      this.dragData = dragData;
    },
    setActiveDropContainerId(id: string | null) {
      this.activeDropContainerId = id;
    },

    updateDropContainerRect(id: string, rect: DOMRect) {
      this.dropContainerRects.set(id, {
        ...this.dropContainerRects.get(id),
        rect,
      });
    },

    registerDropContainer(id: string, data: string[], rect: DOMRect) {
      this.dropContainers[id] = data;

      this.updateDropContainerRect(id, rect);
    },

    unregisterDropContainer(id: string) {
      delete this.dropContainers[id];
    },
  },
});
