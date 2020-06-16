import { Injectable } from '@angular/core';
import { Adapter} from '../interfaces/adapter';

export class PayrollProvider {
  constructor(
    public complianceStats: object,
    public grossPayTotal: number,
    public labourCostTotal: number,
    public name: string,
    public payrollAdminTotal: number,
    public providerId: number,
    public rebatesTotal: number,
    public workerCount: number
  ) {}
}

@Injectable({
  providedIn: 'root'
})
export class ProviderAdapter implements Adapter<PayrollProvider>{
  adapt(item: any): PayrollProvider {
    return new PayrollProvider(
      item.complianceStats,
      item.grossPayTotal,
      item.labourCostTotal,
      item.name,
      item.payrollAdminTotal,
      item.providerId,
      item.rebatesTotal,
      item.workerCount
    );
  }
}
