import { Departamento } from "src/app/departamentos/models/departamento.models";
import { Equipamento } from "src/app/equipamentos/models/equipamento.models";
import { Funcionario } from "src/app/funcionarios/models/funcionario.model";

export class Requisicao {
    id: string;
    solicitanteId: string;
    solicitante?: Funcionario;
    descricao: string;
    departamentoId : string;
    departamento?: Departamento;
    data: string;
    equipamentoId?: string;
    equipamento?: Equipamento;
    
}