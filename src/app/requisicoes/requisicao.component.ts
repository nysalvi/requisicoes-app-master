import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map, Observable } from 'rxjs';
import { Requisicao } from './models/requisicao.model';
import { RequisicaoService } from './services/requisicao.service';
import { ToastrService } from 'ngx-toastr';
import { FuncionarioService } from '../funcionarios/services/funcionario.service';
import { DepartamentoService } from '../departamentos/services/departamento.service';
import { AuthenticationService } from '../auth/services/authentication.service';
import { Router } from '@angular/router';
import { Equipamento } from '../equipamentos/models/equipamento.models';
import { Departamento } from '../departamentos/models/departamento.models';
import { Funcionario } from '../funcionarios/models/funcionario.model';
import { EquipamentoService } from '../equipamentos/services/equipamento.service';

@Component({
  selector: 'app-requisicao',
  templateUrl: './requisicao.component.html',
  styleUrls: ['./requisicao.component.css']
})
export class RequisicaoComponent implements OnInit {
  private funcionarioLogado: Funcionario;

  public funcionarios$: Observable<Funcionario[]>;
  public departamentos$: Observable<Departamento[]>;
  public equipamentos$: Observable<Equipamento[]>;
  public requisicoes$: Observable<Requisicao[]>;
  public form: FormGroup;

  constructor(
    private authService : AuthenticationService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private requisicaoService: RequisicaoService,
    private funcionarioService: FuncionarioService,
    private equipamentoService: EquipamentoService,
    private departamentoService: DepartamentoService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.funcionarios$ = this.funcionarioService.selecionarTodos();  
    this.departamentos$ = this.departamentoService.selecionarTodos();  
    this.equipamentos$ = this.equipamentoService.selecionarTodos();

    this.form = this.fb.group({
      id: new FormControl(""),
      solicitante: new FormControl(""),
      descricao: new FormControl("", [Validators.required, Validators.minLength(15)]),
      departamentoId: new FormControl("", [Validators.required]),
      departamento: new FormControl(""),
      data: new FormControl(""),
      equipamentoId: new FormControl(""),
      equipamento: new FormControl("")
    })
    this.obterFuncionarioLogado();
  }
  get tituloModal(): string {
    return this.id?.value ? "Atualiza????o" : "Cadastro";
  }
  get id() : AbstractControl | null{
    return this.form.get("requisicao.id");
  }
  get solicitanteId() : AbstractControl | null{
    return this.form.get("requisicao.solicitanteId");
  } 
  get solicitante() : AbstractControl | null{
    return this.form.get("requisicao.solicitante");
  }  
  get descricao() : AbstractControl | null{
    return this.form.get("requisicao.descricao");
  }
  get departamentoId() : AbstractControl | null{
    return this.form.get("requisicao.departamentoId");
  }
  get departamento() : AbstractControl | null{
    return this.form.get("requisicao.departamento");
  }
  get data() : AbstractControl | null{
    return this.form.get("requisicao.data");
  }  
  get equipamentoId() : AbstractControl | null{
    return this.form.get("requisicao.equipamentoId");
  }  
  get equipamento() : AbstractControl | null{
    return this.form.get("requisicao.equipamento");
  }  
  obterFuncionarioLogado() {
    this.authService.usuarioLogado
      .subscribe(dados => {
        this.funcionarioService.selecionarFuncionarioLogado(dados?.email!)
          .subscribe(funcionario => {
            this.funcionarioLogado = funcionario;
          this.obterMinhasRequisicoes();
          })
      })
  }

  obterMinhasRequisicoes() {
    this.requisicoes$ = this.requisicaoService.selecionarTodos()
      .pipe(
        map(requisicoes => {
          return requisicoes.filter(r => r.solicitante?.email === this.funcionarioLogado.email);
      } )
    )
  }

  obterRequisicoesDoMeuDepartamento() {
    this.requisicoes$ = this.requisicaoService.selecionarTodos()
      .pipe(
        map(requisicoes => {
          return requisicoes.filter(r => r.departamentoId === this.funcionarioLogado.departamentoId);
      } )
    )
  }
  //m??todo para gravar o novo requisicao
  public async gravar(modal: TemplateRef<any>, requisicao?: Requisicao) {
    this.form.reset(); //para limpar todos os dados do formulario, caso possa ter

    if (requisicao){ // esse if seria para caso o objeto selecionado j?? seja um equipamento, assim j?? retorna o pr??prio equipamento da EDI????O
      this.form.setValue(requisicao);
      try {
        await this.modalService.open(modal).result;
        
        if (requisicao)
          await this.requisicaoService.editar(this.form.value); // caso seja um requisicao ja instanciado, vai para o metodo editar
        
        else{
          this.form.get("requisicao.data")?.setValue(new Date().toLocaleDateString());
          await this.requisicaoService.inserir(this.form.value); // caso contrario, ?? inserido um requisicao novo

        }
        
        this.toastrService.success("A requisi????o foi salva com sucesso", "Cadastro de Requisi????es");
      } 
      catch (error) {
          if (error!= "fechar" && error != "0" && error!= "1")
            this.toastrService.error("Houve um erro ao salvar a requisi????o. Tente novamente.", "Cadastro de Requisi????es");
      }
    }
  }
  public async excluir(requisicao: Requisicao) {
    try {
      await this.requisicaoService.excluir(requisicao);
      this.toastrService.success("A requisi????o foi exclu??da com sucesso", "Cadastro de Requisi????es");
    }
    catch (error){
      this.toastrService.error("Houve um erro ao exclu??r o requisi????o. Tente novamente", "Cadastro de Requisi????es");
    }
  }

}
