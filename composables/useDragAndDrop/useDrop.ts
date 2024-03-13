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
    transferItem,
    $state,
  } = useDndStore();

  const isOver = computed(() => {
    return $state.activeDropContainerId === containerId;
  });

  // async function onDrop() {
  //   if (isOver.value) {
  //     // !temp: only allow one item in a container
  //     if ($state.dropContainers[containerId].length === 0) {
  //       console.log('dropped', $state.dragData, 'into container', containerId);
  //       $state.dropContainers[containerId].push($state.dragData);
  //     }
  //   }
  // }

  // !bug: transfering an item to a container an existing item causes issues
  async function onDrop() {
    if (isOver.value && $state.activeDropContainerId && $state.dragData) {
      // Identify the source container of the dragged item
      const sourceContainerId = Object.keys($state.dropContainers).find(
        (containerId) =>
          $state.dropContainers[containerId].includes($state.dragData!)
      );

      // If the item comes from another container, transfer it
      if (sourceContainerId && sourceContainerId !== containerId) {
        transferItem(sourceContainerId, containerId, $state.dragData);
        // console.log(
        //   `Item ${$state.dragData} transferred from ${sourceContainerId} to ${containerId}`
        // );
      } else if (!sourceContainerId) {
        // Handle the case where the item is not yet assigned to any container
        if ($state.dropContainers[containerId].length === 0) {
          // console.log(
          //   'dropped',
          //   $state.dragData,
          //   'into container',
          //   containerId
          // );
          $state.dropContainers[containerId].push($state.dragData);
        }
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
