import React from "react";
import { KanbanBoard } from "../components/board/kanban-board";
import { Navbar } from "../components/board/navbar";

export const BoardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col">
      <Navbar />
      <main className="flex-1 p-6 overflow-hidden">
        <KanbanBoard />
      </main>
    </div>
  );
};
