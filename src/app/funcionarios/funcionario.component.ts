import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit, TemplateRef } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../auth/services/authentication.service';
import { Departamento } from '../departamentos/models/departamento.models';
import { DepartamentoService } from '../departamentos/services/departamento.service';
import { Funcionario } from './models/funcionario.model';
import { FuncionarioService } from './services/funcionario.service';

@Component({
  selector: 'app-funcionario',
  templateUrl: './funcionario.component.html',
  styleUrls: ['./funcionario.component.css']
})
export class FuncionarioComponent implements OnInit {

  public funcionarios$: Observable<Funcionario[]>;
  public departamentos$: Observable<Departamento[]>;
  public form: FormGroup;

  constructor(
    private router: Router, 
    private authService : AuthenticationService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private funcionarioService: FuncionarioService,
    private departamentoService: DepartamentoService,
    private toastrService: ToastrService
  ) { }


  ngOnInit(): void {
    this.form = this.fb.group({
      funcionario: new FormGroup({
        id: new FormControl(""),
        nome: new FormControl("", [Validators.required, Validators.minLength(3)]),
        email: new FormControl("", [Validators.required, Validators.email]),
        funcao: new FormControl("", [Validators.required, Validators.minLength(3)]),
        departamentoId: new FormControl("", [Validators.required]),
        departamento: new FormControl(""),
      }),
      senha: new FormControl("")
    });
    this.funcionarios$ = this.funcionarioService.selecionarTodos();  
    this.departamentos$ = this.departamentoService.selecionarTodos();  
  }

  

  get tituloModal(): string {
    return this.id?.value ? "Atualização" : "Cadastro";
  }
  get id() : AbstractControl | null{
    return this.form.get("funcionario.id");
  }
  get nome() : AbstractControl | null{
    return this.form.get("funcionario.nome");
  }
  get email() : AbstractControl | null{
    return this.form.get("funcionario.email");
  }
  get funcao() : AbstractControl | null{
    return this.form.get("funcionario.funcao");
  }  
  get departamentoId() : AbstractControl | null{
    return this.form.get("funcionario.departamentoId");
  }
  get senha(): AbstractControl | null{
    return this.form.get("funcionario.senha");
  }
  get departamento() : AbstractControl | null{
    return this.form.get("funcionario.departamento");
  }  
  //método para gravar o novo equipamento
  public async gravar(modal: TemplateRef<any>, funcionario?: Funcionario) {

    this.form.reset(); //para limpar todos os dados do formulario, caso possa ter

    if (funcionario){ // esse if seria para caso o objeto selecionado já seja um equipamento, assim já retorna o próprio equipamento da EDIÇÂO
      const departamento = funcionario.departamento ? funcionario.departamento : null;
      
      const funcionarioCompleto = {
        ...funcionario, 
        departamento
      }
      this.form.get("funcionario")?.setValue(funcionarioCompleto);
    }
    try {
      await this.modalService.open(modal).result;
      
      if (this.form.valid && this.form.dirty){        
        if (funcionario){
          await this.funcionarioService.editar(this.form.get("funcionario")?.value); // caso seja um equipamento ja instanciado, vai para o metodo editar        
        }
        else{
          await this.authService.cadastrar(this.email?.value, this.senha?.value);
          await this.funcionarioService.inserir(this.form.get("funcionario")?.value) // caso contrario, é inserido um equipamento novo
          await this.authService.logout();
          await  this.router.navigate(["/login"]);
        }
        this.toastrService.success("O funcionario foi salvo com sucesso", "Cadastro de Funcionários");        
      }
    } catch (error) {
        if (error!= "fechar" && error != "0" && error!= "1")
          this.toastrService.error("Houve um erro ao salvar o funcionario. Tente novamente.", "Cadastro de Funcionários");
    }
  }

  public async excluir(funcionario: Funcionario) {
    try {
      await this.funcionarioService.excluir(funcionario);
      this.toastrService.success("O funcionario foi excluído com sucesso", "Cadastro de Funcionários");
    }
    catch (error){
      this.toastrService.error("Houve um erro ao excluír o funcionario. Tente novamente", "Cadastro de Funcionários");
    }
  }
}
