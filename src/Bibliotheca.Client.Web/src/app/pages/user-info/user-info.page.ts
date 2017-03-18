import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service';

@Component({
    selector: 'app-user-info',
    templateUrl: './user-info.page.html'
})
export class UserInfoPage implements OnInit {

    constructor(private header: HeaderService) { 
        header.title = "User";
    }

    ngOnInit() {
    }
}
