import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Equipamento } from './models/equipamento.models';
import { EquipamentoService } from './services/equipamento.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-equipamento',
  templateUrl: './equipamento.component.html',
  styleUrls: ['./equipamento.component.css']
})
export class EquipamentoComponent implements OnInit {
  public equipamentos$: Observable<Equipamento[]>;
  public form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private equipamentoService: EquipamentoService,
    private toastrService: ToastrService
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
      this.toastrService.success("O equipamento foi salvo com sucesso", "Cadastro de Equipamentos");
    } catch (error) {
        if (error!= "fechar" && error != "0" && error!= "1")
          this.toastrService.error("Houve um erro ao salvar o equipamento. Tente novamente.", "Cadastro de Equipamentos");
    }
  }

  public async excluir(equipamento: Equipamento) {
    try {
      await this.equipamentoService.excluir(equipamento);
      this.toastrService.success("O equipamento foi excluído com sucesso", "Cadastro de Equipamentos");
    }
    catch (error){
      this.toastrService.error("Houve um erro ao excluír o equipamento. Tente novamente", "Cadastro de Equipamentos");
    }
  }

}
