import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Equipamento } from './models/equipamento.models';
import { EquipamentoService } from './services/equipamento.service';

@Component({
  selector: 'app-equipamento',
  templateUrl: './equipamento.component.html',
  styleUrls: ['./equipamento.component.css']
})
export class EquipamentoComponent implements OnInit {
  public equipamentos$: Observable<Equipamento[]>;
  public form: FormGroup;

  constructor(
    private equipamentoService: EquipamentoService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.equipamentos$ = this.equipamentoService.selecionarTodos();

    this.form = this.fb.group({
      id: new FormControl(""),
      nome: new FormControl(""),
      preco: new FormControl(""),
      data: new FormControl("")
    })

  }

  get tituloModal(): string {
    return this.id?.value ? "Atualização" : "Cadastro";
  }

  get nomeString(): string {
    return this.nome?.value;
  }
  get id() {
    return this.form.get("id");
  }

  get nome() {
    return this.form.get("nome");
  }
  get preco() {
    return this.form.get("preco");
  }
  get data() {
    return this.form.get("data");
  }  

  //método para gravar o novo equipamento
  public async gravar(modal: TemplateRef<any>, equipamento?: Equipamento) {

    this.form.reset(); //para limpar todos os dados do formulario, caso possa ter

    if (equipamento) // esse if seria para caso o objeto selecionado já seja um equipamento, assim já retorna o próprio equipamento da EDIÇÂO
      this.form.setValue(equipamento);

    try {
      await this.modalService.open(modal).result;

      if (equipamento)
        await this.equipamentoService.editar(this.form.value); // caso seja um equipamento ja instanciado, vai para o metodo editar
      else
        await this.equipamentoService.inserir(this.form.value) // caso contrario, é inserido um equipamento novo

      console.log("O equipamento foi salvo com sucesso");
    } catch (error) {
      console.log(error);
    }
  }

  public excluir(equipamento: Equipamento) {
    this.equipamentoService.excluir(equipamento);
  }

}
