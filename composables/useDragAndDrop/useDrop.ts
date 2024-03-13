import { useDndStore } from './dndStore'; // Adjust the path as necessary

export function useDrop(
  target: Ref<HTMLElement | null>,
  containerId: string,
  initialState = [] as string[]
) {
  const {
    setDragData,
    registerDropContainer,
    unregisterDropContainer,
    setActiveDropContainerId,
    $state,
  } = useDndStore();

  const isOver = computed(() => {
    return $state.activeDropContainerId === containerId;
  });

  async function onDrop() {
    if (isOver.value) {
      // !temp: only allow one item in a container
      if ($state.dropContainers[containerId].length === 0) {
        console.log('dropped', $state.dragData, 'into container', containerId);
        $state.dropContainers[containerId].push($state.dragData);
      }
    }
  }

  onMounted(() => {
    registerDropContainer(
      containerId,
      initialState,
      target.value!.getBoundingClientRect()
    );
  });

  onUnmounted(() => {
    unregisterDropContainer(containerId);
  });

  // trigger onDrop when dragging ends
  watch(
    () => $state.isDragging,
    async (newVal) => {
      if (!newVal) {
        await onDrop();
        setDragData(null);
        setActiveDropContainerId(null);
      }
    }
  );

  return {
    dndState: $state,
    isOver,
  };
}
