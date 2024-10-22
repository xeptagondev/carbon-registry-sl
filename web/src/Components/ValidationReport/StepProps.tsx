import { FormInstance } from 'antd';
import { i18n } from 'i18next';

export interface ValidationStepsProps {
  next?: () => void;
  prev?: () => void;
  form: FormInstance;
  current: number;
  countries?: string[];
  t: any;
  handleValuesUpdate: (val: any) => void;
  submitForm?: (appendixVals: any) => void;
  projectCategory?: string;
  cmaDetails?: any
}
