import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-payslip',
  templateUrl: './payslip.component.html',
  styleUrls: ['./payslip.component.css']
})
export class PayslipComponent implements OnInit {
  form = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    salary: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]*$')
    ]),
    superRate: new FormControl('', [
      Validators.required,
      Validators.pattern('^[1-9]$|^[1][0-2]$'),
    ]),
    date: new FormControl(new Date())
  });
  public tableData = [];
  public grossIncome = 0;
  constructor() { }

  ngOnInit() {
  }

  onSubmit() {
    this.calculatetaxes(this.form.value)
  }
  public calculatetaxes(value) {
    let annualSalary = value.salary;
    this.grossIncome = Math.round(annualSalary / 12);
    let employeeIncomeTax = this.incomeTax(annualSalary),
      netIncome = this.grossIncome - this.incomeTax(annualSalary),
      superAmount = Math.round((this.grossIncome * value.superRate) / 100),
      newDate = new Date(value.date),
      months_name = ["Jan", "Feb", "Mar",
        "Apr", "May", "Jun", "Jul", "Aug", "Sep",
        "Oct", "Nov", "Dec"],
      month = months_name[newDate.getMonth()],
      date = `${newDate.getDate()} ${month}`,
      lastDay = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0),
      lastDate = `${lastDay.getDate()} ${month}`;

    this.tableData = [
      {
        name: `${value.firstName} ${value.lastName}`,
        payperiod: `${date}-${lastDate}`,
        grossIncome: this.grossIncome,
        incomeTax: employeeIncomeTax,
        netIncome: netIncome,
        superAmount: superAmount
      }
    ]
    console.table(this.tableData);


  };
  public incomeTax(annualSalary) {
    switch (true) {
      case (annualSalary > 0 && annualSalary < 18200):
        return 0;
      case (annualSalary > 18200 && annualSalary < 37000):
        return Math.round(((this.grossIncome - 18200) * 0.19) / 12)
      case (annualSalary > 37000 && annualSalary < 87000):
        return Math.round(((annualSalary - 37000) * 0.325 + 3572) / 12)
      case (annualSalary > 87000 && annualSalary < 180000):
        return Math.round(((annualSalary - 87000) * 0.37 + 19822) / 12)
      case (annualSalary > 180000):
        return Math.round(((annualSalary - 180000) * 0.45 + 54232) / 12)
      default: return 0
    }
  }
}
