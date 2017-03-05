import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service';

@Component({
  selector: 'app-error500',
  templateUrl: './error500.page.html'
})
export class Error500Page implements OnInit {

  constructor(private header: HeaderService) {
    header.title = "Server error";
  }

  ngOnInit() {
  }

}
