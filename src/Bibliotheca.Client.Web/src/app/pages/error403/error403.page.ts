import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service';

@Component({
  selector: 'app-error403',
  templateUrl: './error403.page.html'
})
export class Error403Page implements OnInit {

  constructor(private header: HeaderService) {
    header.title = "Forbidden";
  }

  ngOnInit() {
  }

}
