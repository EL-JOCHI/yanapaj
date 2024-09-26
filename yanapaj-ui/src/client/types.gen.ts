// This file is auto-generated by @hey-api/openapi-ts

export type TaskRequest = {
  title: string;
  description?: string;
  dueDate: string;
  status?: "TODO" | "IN_PROGRESS" | "BLOCKED" | "DONE";
};

export type status = "TODO" | "IN_PROGRESS" | "BLOCKED" | "DONE";

export type Task = {
  id?: string;
  title: string;
  description?: string;
  dueDate: string;
  status?: "TODO" | "IN_PROGRESS" | "BLOCKED" | "DONE";
};

export type SignupRequest = {
  email: string;
  password: string;
};

export type LoginRequest = {
  email?: string;
  password?: string;
};

export type PageTask = {
  totalElements?: number;
  totalPages?: number;
  size?: number;
  content?: Array<Task>;
  number?: number;
  sort?: Array<SortObject>;
  numberOfElements?: number;
  pageable?: PageableObject;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
};

export type PageableObject = {
  offset?: number;
  sort?: Array<SortObject>;
  paged?: boolean;
  pageNumber?: number;
  pageSize?: number;
  unpaged?: boolean;
};

export type SortObject = {
  direction?: string;
  nullHandling?: string;
  ascending?: boolean;
  property?: string;
  ignoreCase?: boolean;
};

export type GetTaskByIdData = {
  path: {
    id: string;
  };
};

export type GetTaskByIdResponse = Task;

export type GetTaskByIdError = unknown;

export type UpdateTaskData = {
  body: TaskRequest;
  path: {
    id: string;
  };
};

export type UpdateTaskResponse = Task;

export type UpdateTaskError = unknown;

export type DeleteTaskData = {
  path: {
    id: string;
  };
};

export type DeleteTaskResponse = Task;

export type DeleteTaskError = unknown;

export type GetTasksData = {
  query?: {
    page?: number;
    size?: number;
    sort?: Array<string>;
  };
};

export type GetTasksResponse = PageTask;

export type GetTasksError = unknown;

export type CreateTaskData = {
  body: TaskRequest;
};

export type CreateTaskResponse = Task;

export type CreateTaskError = unknown;

export type SignupData = {
  body: SignupRequest;
};

export type SignupResponse = string;

export type SignupError = unknown;

export type LogoutResponse = unknown;

export type LogoutError = unknown;

export type LoginData = {
  body: LoginRequest;
};

export type LoginResponse = string;

export type LoginError = unknown;
