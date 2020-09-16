import { Component, OnInit, TemplateRef } from '@angular/core';
import { PhonebookService } from '../phonebook.service';
import { Person } from '../models/person.model';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Region } from '../models/region.model';

@Component({
  selector: 'app-person-finder',
  templateUrl: './person-finder.component.html',
  styleUrls: ['./person-finder.component.scss']
})
export class PersonFinderComponent implements OnInit {

  constructor(private phonebookService: PhonebookService, private modalService: BsModalService) { }

  error: boolean;
  allPersons: Person[];
  persons: Person[];
  modalRef: BsModalRef;
  selectedPerson: Person;
  searchText: string;
  regions: Region[];

  ngOnInit(): void {
    this.getPersons();
    this.getRegions();
  }

  /**
   * Abre el modal de la persona seleccionada
   * @param template Template del modal
   * @param person Persona a mostrar
   */
  openModal(template: TemplateRef<any>, person: Person) {
    this.modalRef = this.modalService.show(template);
    this.selectedPerson = person;
  }

  /**
   * Realiza llamada al servicio para traer los datos de las regiones de la API
   */
  getRegions(): void {
    this.phonebookService.getRegions()
    .subscribe(
      (res: any) => {
        if (res === undefined || res === null || res.length === 0) {
          this.error = true;
          throw new Error('No se recibieron datos de las regiones.');
          return;
        }

        this.error = false;
        this.regions = res;
        return;

      },
      (err) => {
        this.error = true;
        console.error(err);
        throw new Error('Ocurrió un error al ejecutar la petición de regiones. Intenta nuevamente.');
        return;
      }
    );
  }

  /**
   * Realiza llamada al servicio para traer los datos de las personas de la API
   */
  getPersons(): void {
    this.phonebookService.getPersons()
    .subscribe(
      (res: any) => {
        if (res === undefined || res === null || res.length === 0) {
          this.error = true;
          throw new Error('No se recibieron datos de las personas.');
          return;
        }

        this.error = false;
        this.allPersons = res;
        // No considera personas inactivas
        this.allPersons = this.allPersons.filter(person => person.activo === 1);
        this.persons = [...this.allPersons];
        return;

      },
      (err) => {
        this.error = true;
        console.error(err);
        throw new Error('Ocurrió un error al ejecutar la petición de personas. Intenta nuevamente.');
        return;
      }
    );
  }

  /**
   * Revisa si la cantidad de dígitos es 11
   * @param num Número a evaluar
   */
  isPhoneCorrect(num: number): boolean {
    if (num.toString().length === 11) {
      return true;
    }

    return false;
  }

  /**
   * Verifica que el rut esté correcto
   * @param completeRut Rut Completo
   */
  isRutCorrect(completeRut: string): boolean {
    completeRut = completeRut.replace('‐', '-');
    if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test( completeRut )) {
      return false;
    }

    const tmp 	= completeRut.split('-');
    let digv	= tmp[1];
    const rut 	= tmp[0];
    if ( digv === 'K' ) {
      digv = 'k' ;
    }
    return (this.calculateDv(rut) === digv );
  }

  /**
   * Calcula el dígito verificador
   * @param rut rut
   */
  calculateDv(rut: string): any {
    let T = parseInt(rut, 10);
    let M = 0;
    let S = 1;
    for ( ; T ; T = Math.floor(T / 10)) {
      S = (S + T % 10 * (9 - M ++ % 6)) % 11;
    }
    return S ? (S - 1).toString() : 'k';
  }

  /**
   * Verifica que una persona posea su rut y número correcto
   * @param person Persona a verificar
   */
  verifyInfo(person: Person): boolean {
    if (this.isPhoneCorrect(person.telefono) && this.isRutCorrect(person.rut)) {
      return true;
    }

    return false;
  }

  /**
   * Filtra a las personas eliminando las que no corresponden a regiones seleccionadas
   */
  filterPersonsByRegion() {
    this.persons = [...this.allPersons];
    const toDeleteRegions = this.regions.filter(region => !region.checked).map(region => region.comunas);
    if (toDeleteRegions.length !== this.regions.length) {
      toDeleteRegions.forEach(region => {
        this.persons = this.persons.filter(person => region.map(comuna => comuna.id).indexOf(person.direccion.comuna.id) < 0);
      });
    }
  }

}
