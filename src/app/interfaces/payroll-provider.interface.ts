import {PayrollProvider} from '../models/payroll-provider.model';

export interface PayrollProviderInterface extends PayrollProvider{
  complianceScore: number;
  grossPayTotal: number;
  labourCostTotal: number;
  name: string;
  payrollAdminTotal: number;
  providerId: number;
  rebatesTotal: number;
  workerCount: number;
  workForce?: number;
  sortable?: boolean;
}
