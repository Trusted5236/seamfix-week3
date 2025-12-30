import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SearchBarComponent } from '../search-bar/search-bar.component';


@Component({
  selector: 'app-navbar',
  imports: [SearchBarComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  @Input() cartCount: number = 0
  @Output() search = new EventEmitter<string>()

  onSearchEmit (query : string){
    this.search.emit(query)
  }
}
