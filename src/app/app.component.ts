import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {FormsModule} from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule, HttpClientModule,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'di2win';
  dados: any[] = []
  dadosExcel: any
  currentPage: number = 1
  limit: number = 10
  totalItems: number = 0
  docSelecionado: string = ''
  label: string = ''

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.getDados()

    const op = document.querySelector<HTMLDivElement>('#opscreen')!
    op.addEventListener('animationend', () => {
      op.style.translate = '0 100%'
    });
    const mobmenu = document.querySelector<HTMLDivElement>('.mob-menu')!
    const navbar = document.querySelector<HTMLDivElement>('.nav-links')!
    mobmenu.addEventListener('click', function () {
      this.classList.toggle('ativo')
      navbar.classList.toggle('ativo')
    });
  }
  
  getDados(): void {
    const parametros: any = {
    page: this.currentPage,
    limit: this.limit,
    tags: []
  }

  // Apenas adiciona o parâmetro se ele não for vazio
  if (this.docSelecionado) {
    parametros.tags = [this.docSelecionado];
  }

  if (this.label) {
    parametros.tags = parametros.tags ? [...parametros.tags, this.label] : [this.label];
  }
  
    // Apenas adiciona o parâmetro se ele não for vazio
    if (this.docSelecionado) {
      parametros.tags = [this.docSelecionado];
    }
  
    if (this.label) {
      parametros.tags = parametros.tags ? [...parametros.tags, this.label] : [this.label];
    }
    console.log('Parâmetros enviados:', parametros); // Adicionado para debug

    this.apiService.getDados(parametros).subscribe(
      (resposta) => {
        this.dados = resposta.data;
        this.totalItems = resposta.pagination.totalItems;
        console.log(resposta);
        console.log('Itens totais: ' + this.totalItems);
      },
      (erro) => {
        console.error('Erro obtendo dados:', erro);
      }
    );
  }
  
  exportaDados(){
    this.apiService.exportaDados().subscribe(
      (resposta: Blob) => {

        const url = window.URL.createObjectURL(resposta)
        const a = document.createElement('a')
        a.href = url
        a.download = 'Reports.xlsx'
        a.click()
        window.URL.revokeObjectURL(url)

        this.dadosExcel = resposta
        console.log('Dados recebidos:', this.dadosExcel)
      },
      (erro) => {
        console.error('Erro ao obter dados:', erro)
      }
    ) 
  }

  filtro: string = ''

  filtroSelect: string = ''

  buscaSelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement
    this.docSelecionado = selectElement.value
    this.getDados()
  }

  buscaInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement
    this.label = inputElement.value
    this.getDados()
    console.log('label '+inputElement.value)
  }

  // filtro input
  // get tabelaFiltrada() {
  //   return this.dados.filter(item => {

  //     const matchesInput = item.label.toLowerCase().includes(this.filtro.toLowerCase());

  //     const matchesSelect = this.filtroSelect ? item.type_document.toLowerCase() === this.filtroSelect.toLowerCase() : true;
  
  //     return matchesInput && matchesSelect;
  //   });
  // }
  
  changePage(page:number): void {
    this.currentPage = page
    this.getDados()
  }
}
