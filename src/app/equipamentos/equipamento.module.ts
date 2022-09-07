import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { EquipamentoRoutingModule } from './equipamento-routing.module';
import { EquipamentoComponent } from './equipamento.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EquipamentoService } from './services/equipamento.service';

import ptBr from '@angular/common/locales/pt'
import { registerLocaleData } from '@angular/common';
import { CurrencyMaskModule } from 'ng2-currency-mask';
registerLocaleData(ptBr);

@NgModule({
  declarations: [
    EquipamentoComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    ReactiveFormsModule,
    EquipamentoRoutingModule, 
    CurrencyMaskModule
  ],
  providers: [
    EquipamentoService
  ]
})
export class EquipamentoModule { }
