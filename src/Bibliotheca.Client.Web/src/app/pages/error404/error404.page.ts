import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service';

@Component({
  selector: 'app-error404',
  templateUrl: './error404.page.html'
})
export class Error404Page implements OnInit {

  constructor(private header: HeaderService) {
    header.title = "Page not found";
  }

  ngOnInit() {
  }

}
