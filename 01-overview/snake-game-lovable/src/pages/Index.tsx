import SnakeGame from "@/components/SnakeGame";

const Index = () => {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl text-primary text-glow mb-8 tracking-wider">
        SNAKE
      </h1>
      <SnakeGame />
      <footer className="mt-8 text-muted-foreground text-[8px]">
        A CLASSIC ARCADE GAME
      </footer>
    </main>
  );
};

export default Index;
