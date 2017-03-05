import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service';

@Component({
  selector: 'app-error400',
  templateUrl: './error400.page.html'
})
export class Error400Page implements OnInit {

  constructor(private header: HeaderService) {
    header.title = "Error";
  }

  ngOnInit() {
  }

}
