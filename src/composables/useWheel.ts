import { onMounted, onUpdated, readonly } from 'vue';
import { useStore } from '@/store';
import useGanttRef from './useGanttRef';
import useTableRef from './useTableRef';

export default () => {
  const { ganttRef } = useGanttRef();
  const { tableRef } = useTableRef();
  const store = useStore();

  function tableWheelHandle(e: WheelEvent) {
    const { deltaY } = e;
    if (ganttRef.value) {
      ganttRef.value.scrollTop += deltaY;
      // TODO:滚动左侧没有动画，不如右侧的原生 scroll 顺滑
      // let scrollY = ganttRef.value.scrollTop;
      // console.log(scrollY);

      // let oldTimestamp: number | null = null;
      // function step(timestamp: number) {
      //   if (oldTimestamp !== null && ganttRef.value) {
      //     scrollY -= (deltaY * (timestamp - oldTimestamp)) / 100;
      //     console.log(scrollY);
      //     if (scrollY <= 0) return;
      //     ganttRef.value.scrollTop = scrollY;
      //   }
      //   oldTimestamp = timestamp;
      //   window.requestAnimationFrame(step);
      // }
      // window.requestAnimationFrame(step);
    }
  }

  function ganttWheelHandle() {
    if (tableRef.value) {
      const st = ganttRef.value?.scrollTop as number;
      store.scrollTop.value = st;
      tableRef.value.scrollTop = st;
    }
  }

  function updateScrollBarHeight() {
    if (tableRef.value && ganttRef.value)
      store.scrollBarHeight.value =
        tableRef.value.offsetHeight - ganttRef.value.clientHeight;

    if (tableRef.value) store.rootHeight.value = tableRef.value.offsetHeight;
  }

  // UI 加载后需要更新数据
  onMounted(updateScrollBarHeight);
  onUpdated(updateScrollBarHeight);

  return {
    scrollTop: readonly(store.scrollTop),
    rootHeight: readonly(store.rootHeight),
    scrollBarHeight: readonly(store.scrollBarHeight),

    tableWheelHandle,
    ganttWheelHandle
  };
};
