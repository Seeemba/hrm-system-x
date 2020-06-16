import { Component, OnInit, ViewChild } from '@angular/core';
import { formatNumber } from '@angular/common';
import { MatSort, Sort } from '@angular/material/sort';

import * as _ from 'lodash';

import { MatTableDataSource } from '@angular/material/table';
import { PayrollProviderInterface } from '../../interfaces/payroll-provider.interface';
import { ReportService } from '../report.service';
import { sortTable } from '../../animations/table.animations';

@Component({
  selector: 'app-labour-cost-report',
  templateUrl: './labour-cost-report.component.html',
  styleUrls: ['./labour-cost-report.component.scss'],
  animations: [sortTable]
})
export class LabourCostReportComponent implements OnInit {

  constructor(private reportService: ReportService) {}

  isError: boolean;

  sortedColumn: string;
  sortAnimate: string;

  dataSource: MatTableDataSource<PayrollProviderInterface>;
  directContractors: PayrollProviderInterface[];
  providers: PayrollProviderInterface[];
  total: PayrollProviderInterface;

  displayedColumns: string[] = [
    'name',
    'workerCount',
    'complianceScore',
    'grossPayTotal',
    'payrollAdminTotal',
    'labourCostTotal',
    'workForce'
  ];

  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isError = false;

    this.reportService.list().subscribe((result: any[]) => {
        const data = _.first(result);

        const directContractorsData = _.get(data, 'directContractors');
        if (_.size(directContractorsData)){
          this.directContractors = directContractorsData.map(directContractor => {
            directContractor.sortable = false;
            return directContractor;
          });
        }

        const providersData = _.get(data, 'providers');
        if (_.size(providersData)) {
          this.providers = providersData.map(provider => {
            provider.sortable = true;
            return provider;
          });
        }

        const totalData = _.get(data, 'total');
        if (_.size(totalData)){
          this.total = _.first(totalData.map(total => {
            total.complianceScore = total.complianceStats ? _.get(total.complianceStats, 'Total') / 100 : 0;
            total.grossPayTotal = Math.round(total.grossPayTotal / 100);
            total.labourCostTotal = Math.round(total.labourCostTotal / 100);
            return total;
          }));
        }

        const allProviders: PayrollProviderInterface[] = this.directContractors.concat(this.providers);

        allProviders.map(provider => {
          provider.complianceScore = provider.complianceStats ? _.get(provider.complianceStats, 'Total') / 100 : 0;
          provider.grossPayTotal = provider.grossPayTotal / 100;
          provider.labourCostTotal = provider.labourCostTotal / 100;

          // calculate workForce
          const workerCountTotal = _.get(this.total, 'workerCount');
          if (workerCountTotal) {
            provider.workForce = provider.workerCount / workerCountTotal;
          }
        });

        this.dataSource = new MatTableDataSource(allProviders);
        this.dataSource.sort = this.sort;

        // default sort
        this.sortData({
          active: 'name',
          direction: 'asc'
        });
      },
      error => { // TODO: add Error Handling
        this.isError = true;
        console.log(error);
      }
    );
  }

  sortData(sort: Sort): void{
    const data: Array<PayrollProviderInterface> = this.dataSource.data.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.sortedColumn = sort.active;
    this.sortAnimate = sort.direction;

    this.dataSource.data = data.sort((a, b) => {
        if (_.isEqual(sort.active, 'name') && (!a.sortable || !b.sortable)) {
          return 1;
        } else {
          const isAsc: boolean = sort.direction === 'asc';
          return this.compare(a[sort.active], b[sort.active], isAsc);
        }
      }
    );

    if (_.isEqual(sort.active, 'name')) {
      const index = this.dataSource.data.findIndex(x => !x.sortable);
      if (index !== -1) {
        const tempDirectContractors = this.dataSource.data[index];
        this.dataSource.data.splice(index, 1);
        this.dataSource.data.unshift(tempDirectContractors);
      }
    }

    this.dataSource = new MatTableDataSource<PayrollProviderInterface>(this.dataSource.data);
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    if (typeof a === 'string') {
      a = a.toLowerCase();
    }
    if (typeof b === 'string') {
      b = b.toLowerCase();
    }
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  getTotal(columnName: string) {
    return this.total && this.total[columnName] > 0 ? formatNumber(this.total[columnName], 'en-GB') : '-';
  }
}
