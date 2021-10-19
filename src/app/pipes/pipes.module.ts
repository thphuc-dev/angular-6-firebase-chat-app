import { NgModule } from '@angular/core';
import { AccountingPipe } from './accounting/accounting';
import { LoopPipe } from './loop/loop';
import { BillFilterPipe } from './bill-filter/bill-filter';
import { UtcDatePipe } from './utc-date/utcDate';
@NgModule({
  declarations: [AccountingPipe,
    LoopPipe, BillFilterPipe, UtcDatePipe],
  imports: [],
  exports: [AccountingPipe,
    LoopPipe, BillFilterPipe, UtcDatePipe]
})
export class PipesModule {
  static forRoot() {
    return {
      ngModule: PipesModule,
      providers: [],
    };
  }
}
