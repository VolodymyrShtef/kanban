import KanbanBoard from "./screens/KanbanBoard";

const Home = () => {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] min-h-screen p-4 pt-2 gap-10 font-[family-name:var(--font-geist-sans)]">
      <main className="flex row-start-2">
        <KanbanBoard />
      </main>
    </div>
  );
};

export default Home;
