import { useDndStore } from './dndStore';

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
    transferItem,
    $state,
  } = useDndStore();

  const isOver = computed(() => {
    return $state.activeDropContainerId === containerId;
  });

  // !bug: transfering an item to a container an existing item causes issues
  async function onDrop() {
    if (isOver.value && $state.activeDropContainerId && $state.dragData) {
      const sourceContainerId = Object.keys($state.dropContainers).find((id) =>
        $state.dropContainers[id].includes($state.dragData!)
      );

      if (sourceContainerId && sourceContainerId !== containerId) {
        transferItem(sourceContainerId, containerId, $state.dragData);
      } else if (!sourceContainerId) {
        // Ensure no duplicates are added
        if (!$state.dropContainers[containerId].includes($state.dragData)) {
          $state.dropContainers[containerId].push($state.dragData);
        }
      }
    }
  }

  const updateZoneRect = useThrottleFn(() => {
    if (target.value) {
      registerDropContainer(
        containerId,
        initialState,
        target.value.getBoundingClientRect()
      );
    }
  }, 1000);

  onMounted(() => {
    window.addEventListener('scroll', updateZoneRect);
    window.addEventListener('resize', updateZoneRect);

    updateZoneRect(); // Initial update
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', updateZoneRect);
    window.removeEventListener('resize', updateZoneRect);
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
