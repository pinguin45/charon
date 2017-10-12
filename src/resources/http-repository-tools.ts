import {IErrorResponse} from '../contracts/index';

export function isErrorResult(result: any | IErrorResponse): result is IErrorResponse {
  return result.error !== undefined;
}

export async function throwOnErrorResponse<TResult = any>(response: Response): Promise<TResult> {
  const result: TResult | IErrorResponse = await response.json();
  if (isErrorResult(result)) {
    throw new Error(result.error);
  }

  return result;
}
