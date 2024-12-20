import { Moon, Sun } from "lucide-react";
import Button from "./Button";

const ThemeToggle = ({ theme, onToggle }) => {
  return (
    <Button
      onClick={onToggle}
      className="rounded-full hover:bg-accent hover:text-accent-foreground h-7 w-7 absolute left-5 top-5"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
      <span className="sr-only">Перемикач теми</span>
    </Button>
  );
};

export default ThemeToggle;
