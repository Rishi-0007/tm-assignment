"use client";

import { Task } from "@/types/task";
import { Edit, Trash2, CheckCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
  return (
    <div className={cn(
      "p-4 bg-white rounded-lg shadow border transition-all hover:shadow-md",
      task.status === 'completed' ? "opacity-75 bg-gray-50" : "bg-white"
    )}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <button
            onClick={() => onToggle(task.id)}
            className="mt-1 text-gray-400 hover:text-green-600 transition-colors"
          >
            {task.status === 'completed' ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <Circle className="w-6 h-6" />
            )}
          </button>
          
          <div className="flex-1">
            <h3 className={cn(
              "font-semibold text-lg text-gray-900",
              task.status === 'completed' && "line-through text-gray-500"
            )}>
              {task.title}
            </h3>
            {task.description && (
              <p className={cn(
                "mt-1 text-gray-600 text-sm whitespace-pre-wrap",
                task.status === 'completed' && "text-gray-400"
              )}>
                {task.description}
              </p>
            )}
            <span className="inline-block mt-2 text-xs text-gray-400">
              {new Date(task.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
