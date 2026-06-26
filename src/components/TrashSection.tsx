import React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import TrashItem from "@/components/TrashItem";

interface Task {
  id: string;
  title: string;
  status: string;
  due_date: string | null;
  priority: string;
  category?: string;
  deleted_at: string | null;
}

interface TrashSectionProps {
  deletedTasks: Task[];
  onRefresh: () => void;
  onEmptyTrash: () => void;
}

/**
 * Seção de lixeira com lista de tarefas deletadas
 * e botão para esvaziar.
 */
const TrashSection = ({ deletedTasks, onRefresh, onEmptyTrash }: TrashSectionProps) => {
  return (
    <section className="space-y-3 pt-4 border-t border-white/8">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Lixeira ({deletedTasks.length})
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onEmptyTrash}
          className="h-7 text-[10px] font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 uppercase tracking-wider px-2 rounded-lg"
        >
          <Trash2 className="h-3 w-3 mr-1" />
          Esvaziar
        </Button>
      </div>
      <div className="space-y-2">
        {deletedTasks.map((task) => (
          <TrashItem key={task.id} task={task} onUpdate={onRefresh} />
        ))}
      </div>
    </section>
  );
};

export default TrashSection;