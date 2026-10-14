export interface IApiResponse<T = any, M = any> {
  success: boolean;
  message?: string;
  meta?: M;
  data?: T;
  errors?: IApiError[];
  traceId?: string;
  [key: string]: any;
}

export interface IApiError {
  code?: string;
  message?: string;
  field?: string;
}

export type ApiResponse<T = any, M = any> = IApiResponse<T, M>;
export type ApiError = IApiError;



