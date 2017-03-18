import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html'
})
export class UsersPage implements OnInit {

  constructor(private header: HeaderService) { 
    header.title = "Users";
  }

  ngOnInit() {
    window.scrollTo(0,0);
  }

}
