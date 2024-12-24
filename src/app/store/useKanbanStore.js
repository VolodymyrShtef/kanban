const useKanbanStore = () => {
  const initialTasks = [
    {
      id: "1",
      title: "Додати Tailwind CSS, SnadcnUI, dndkit, zod",
      status: "TODO",
      createdAt: "2024-12-11",
    },
    {
      id: "2",
      title: "Створити перемикач теми",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean lobortis.",
      status: "TODO",
      createdAt: "2024-12-12",
    },
    {
      id: "3",
      title: "Додати функціонал DND",
      status: "TODO",
      createdAt: "2024-12-14",
    },
    {
      id: "4",
      title: "Ініціалізація Next.js проекту",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      status: "IN_PROGRESS",
      createdAt: "2024-12-15",
      dueDate: "2024-12-25",
    },
  ];

  const getTasks = () => {
    const storedTasks = localStorage.getItem("kanbanTasks");

    return storedTasks ? JSON.parse(storedTasks) : initialTasks;
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
