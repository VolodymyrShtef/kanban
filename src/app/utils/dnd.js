import { arrayMove } from "@dnd-kit/sortable";
import { findBoardSectionContainer } from "./utils";

const dragOverHandler = (active, over, boardSections, setBoardSections) => {
  const activeContainer = findBoardSectionContainer(boardSections, active.id);
  const overContainer = findBoardSectionContainer(boardSections, over?.id);

  if (!activeContainer || !overContainer || activeContainer === overContainer) {
    return;
  }

  setBoardSections((boardSections) => {
    const activeItems = boardSections[activeContainer];
    const overItems = boardSections[overContainer];

    const activeIndex = activeItems.findIndex((item) => item.id === active.id);
    const overIndex = overItems.findIndex((item) => item.id !== over?.id);

    return {
      ...boardSections,
      [activeContainer]: [
        ...boardSections[activeContainer].filter(
          (item) => item.id !== active.id
        ),
      ],
      [overContainer]: [
        ...boardSections[overContainer].slice(0, overIndex),
        boardSections[activeContainer][activeIndex],
        ...boardSections[overContainer].slice(
          overIndex,
          boardSections[overContainer].length
        ),
      ],
    };
  });
};

const dragEnd = (active, over, boardSections, setBoardSections) => {
  const activeContainer = findBoardSectionContainer(boardSections, active.id);
  const overContainer = findBoardSectionContainer(boardSections, over?.id);

  if (!activeContainer || !overContainer || activeContainer !== overContainer) {
    return;
  }

  const activeIndex = boardSections[activeContainer].findIndex(
    (task) => task.id === active.id
  );
  const overIndex = boardSections[overContainer].findIndex(
    (task) => task.id === over?.id
  );

  if (activeIndex !== overIndex) {
    setBoardSections((boardSection) => ({
      ...boardSection,
      [overContainer]: arrayMove(
        boardSection[overContainer],
        activeIndex,
        overIndex
      ),
    }));
  }

  return overContainer;
};

export { dragOverHandler, dragEnd };
