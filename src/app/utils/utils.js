import { statusConfig } from "../configs/core";

export const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getTasksByStatus = (tasks, status) => {
  return tasks.filter((task) => task.status === status);
};

export const getTaskById = (tasks, id) => {
  return tasks.find((task) => task.id === id);
};

export const initializeBoard = (tasks) => {
  const boardSections = {};

  Object.keys(statusConfig).forEach((boardSectionKey) => {
    boardSections[boardSectionKey] = getTasksByStatus(tasks, boardSectionKey);
  });

  return boardSections;
};

export const findBoardSectionContainer = (boardSections, id) => {
  if (id in boardSections) {
    return id;
  }

  const container = Object.keys(boardSections).find((key) =>
    boardSections[key].find((item) => item.id === id)
  );

  return container;
};
