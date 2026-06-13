import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  type Tool,
  type Prompt,
  type Workflow,
  type TaskRecord,
  type ToolApplication,
  type ToolQuota,
  type WorkflowStep,
  type OptimizationSuggestion,
  type ToolCategory,
  type ApplicationStatus,
  type SuggestionType,
  type SuggestionSeverity,
  mockTools,
  mockPrompts,
  mockWorkflows,
  mockTaskRecords,
  mockToolApplications,
  mockOptimizationSuggestions,
} from '../utils/mockData';

export type {
  Tool,
  ToolCategory,
  ToolQuota,
  Prompt,
  WorkflowStep,
  Workflow,
  TaskRecord,
  ToolApplication,
  ApplicationStatus,
  OptimizationSuggestion,
  SuggestionType,
  SuggestionSeverity,
};

interface StoreState {
  tools: Tool[];
  prompts: Prompt[];
  workflows: Workflow[];
  taskRecords: TaskRecord[];
  toolApplications: ToolApplication[];
  optimizationSuggestions: OptimizationSuggestion[];
}

interface StoreActions {
  toggleToolFavorite: (toolId: string) => void;
  addToolApplication: (application: Omit<ToolApplication, 'id' | 'createdAt'>) => void;
  approveApplication: (applicationId: string) => void;
  rejectApplication: (applicationId: string) => void;
  togglePromptFavorite: (promptId: string) => void;
  addPrompt: (prompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePrompt: (promptId: string, updates: Partial<Omit<Prompt, 'id' | 'createdAt'>>) => void;
  deletePrompt: (promptId: string) => void;
  addWorkflow: (workflow: Omit<Workflow, 'id' | 'createdAt'>) => void;
  deleteWorkflow: (workflowId: string) => void;
  addTaskRecord: (record: Omit<TaskRecord, 'id' | 'createdAt'>) => void;
  updateTaskRating: (recordId: string, rating: number) => void;
  toggleRecordFavorite: (recordId: string) => void;
  addOptimizationSuggestion: (suggestion: Omit<OptimizationSuggestion, 'id'>) => void;
  dismissSuggestion: (suggestionId: string) => void;
}

type Store = StoreState & StoreActions;

const useStore = create<Store>()(
  persist(
    (set) => ({
      tools: mockTools,
      prompts: mockPrompts,
      workflows: mockWorkflows,
      taskRecords: mockTaskRecords,
      toolApplications: mockToolApplications,
      optimizationSuggestions: mockOptimizationSuggestions,

      toggleToolFavorite: (toolId) =>
        set((state) => ({
          tools: state.tools.map((tool) =>
            tool.id === toolId ? { ...tool, isFavorited: !tool.isFavorited } : tool
          ),
        })),

      addToolApplication: (application) =>
        set((state) => ({
          toolApplications: [
            ...state.toolApplications,
            {
              ...application,
              id: `app-${Date.now()}`,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      approveApplication: (applicationId) =>
        set((state) => ({
          toolApplications: state.toolApplications.map((app) =>
            app.id === applicationId ? { ...app, status: 'approved' as const } : app
          ),
        })),

      rejectApplication: (applicationId) =>
        set((state) => ({
          toolApplications: state.toolApplications.map((app) =>
            app.id === applicationId ? { ...app, status: 'rejected' as const } : app
          ),
        })),

      togglePromptFavorite: (promptId) =>
        set((state) => ({
          prompts: state.prompts.map((prompt) =>
            prompt.id === promptId ? { ...prompt, isFavorited: !prompt.isFavorited } : prompt
          ),
        })),

      addPrompt: (prompt) =>
        set((state) => ({
          prompts: [
            ...state.prompts,
            {
              ...prompt,
              id: `prompt-${Date.now()}`,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        })),

      updatePrompt: (promptId, updates) =>
        set((state) => ({
          prompts: state.prompts.map((prompt) =>
            prompt.id === promptId
              ? { ...prompt, ...updates, updatedAt: new Date().toISOString() }
              : prompt
          ),
        })),

      deletePrompt: (promptId) =>
        set((state) => ({
          prompts: state.prompts.filter((prompt) => prompt.id !== promptId),
        })),

      addWorkflow: (workflow) =>
        set((state) => ({
          workflows: [
            ...state.workflows,
            {
              ...workflow,
              id: `wf-${Date.now()}`,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      deleteWorkflow: (workflowId) =>
        set((state) => ({
          workflows: state.workflows.filter((wf) => wf.id !== workflowId),
        })),

      addTaskRecord: (record) =>
        set((state) => ({
          taskRecords: [
            ...state.taskRecords,
            {
              ...record,
              id: `task-${Date.now()}`,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateTaskRating: (recordId, rating) =>
        set((state) => ({
          taskRecords: state.taskRecords.map((record) =>
            record.id === recordId ? { ...record, rating } : record
          ),
        })),

      toggleRecordFavorite: (recordId) =>
        set((state) => ({
          taskRecords: state.taskRecords.map((record) =>
            record.id === recordId ? { ...record, isFavorited: !record.isFavorited } : record
          ),
        })),

      addOptimizationSuggestion: (suggestion) =>
        set((state) => ({
          optimizationSuggestions: [
            ...state.optimizationSuggestions,
            {
              ...suggestion,
              id: `opt-${Date.now()}`,
            },
          ],
        })),

      dismissSuggestion: (suggestionId) =>
        set((state) => ({
          optimizationSuggestions: state.optimizationSuggestions.filter(
            (s) => s.id !== suggestionId
          ),
        })),
    }),
    {
      name: 'ai-toolbox-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useStore;
