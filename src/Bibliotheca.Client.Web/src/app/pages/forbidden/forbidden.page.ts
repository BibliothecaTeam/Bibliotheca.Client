import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service';

@Component({
  selector: 'app-forbidden',
  templateUrl: './forbidden.page.html'
})
export class ForbiddenPage implements OnInit {

  constructor(private header: HeaderService) {
    header.title = "Forbidden";
  }

  ngOnInit() {
  }

}
