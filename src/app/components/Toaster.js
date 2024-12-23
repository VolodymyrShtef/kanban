import * as Toast from "@radix-ui/react-toast";
import { X } from "lucide-react";

const Toaster = ({ open, onOpenChange, toastConfig }) => {
  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root
        className="group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full border bg-background "
        open={open}
        onOpenChange={onOpenChange}
      >
        <div className="flex-col">
          <Toast.Title className="text-sm font-semibold mb-1">
            {toastConfig.title}
          </Toast.Title>
          <Toast.Description className={`text-sm opacity-90`}>
            {toastConfig.description}
          </Toast.Description>
        </div>
        {toastConfig.action && (
          <Toast.Action
            className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive"
            asChild
            altText="Goto schedule to undo"
          >
            {toastConfig.action}
          </Toast.Action>
        )}
        {!toastConfig.action && (
          <Toast.Close
            className={
              "absolute right-1 top-1 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100"
            }
          >
            <X className="h-4 w-4" />
          </Toast.Close>
        )}
      </Toast.Root>
      <Toast.Viewport className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]" />
    </Toast.Provider>
  );
};

export default Toaster;