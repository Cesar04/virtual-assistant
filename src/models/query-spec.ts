import { Parameter } from './parameter';

export interface QuerySpec {
  query: string;
  parameters: Parameter[];
}
