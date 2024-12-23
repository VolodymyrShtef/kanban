const useKanbanStore = () => {
  const initialTasks = [
    {
      id: "1",
      description: "Додати Tailwind CSS, SnadcnUI, dndkit, zod",
      status: "TODO",
      createdAt: new Date(),
    },
    {
      id: "2",
      description: "Створити перемикач теми",
      status: "TODO",
      createdAt: new Date(),
    },
    {
      id: "3",
      description: "Додати функціонал DND",
      status: "TODO",
      createdAt: new Date(),
    },
    {
      id: "4",
      description: "Ініціалізація Next.js проекту",
      status: "IN_PROGRESS",
      createdAt: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  ];

  const getTasks = () => {
    const storedTasks = JSON.parse(localStorage.getItem("kanbanTasks"));

    return storedTasks?.length ? storedTasks : initialTasks;
  };

  const saveTasks = (tasks) => {
    localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
  };

  return {
    initialTasks,
    getTasks,
    saveTasks,
  };
};

export default useKanbanStore;
