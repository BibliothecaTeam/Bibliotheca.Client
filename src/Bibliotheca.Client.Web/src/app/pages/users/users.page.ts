import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service';
import { HttpClientService } from '../../services/http-client.service';
import { ToasterService } from 'angular2-toaster';
import { User } from '../../entities/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html'
})
export class UsersPage implements OnInit {

  private users: User[];

  constructor(private header: HeaderService, private http: HttpClientService, private toaster: ToasterService) { 
      header.title = "Users";

      http.get('/api/users').subscribe(result => {
          this.users = result.json();
      });
  }

  ngOnInit() {
    window.scrollTo(0,0);
  }

    tryDeleteUser(user: User) {
        user["deletionMode"] = true;
    }

    cancelDeleteUser(user: User) {
        user["deletionMode"] = false;
    }

    confirmDeleteUser(index: number) {
        var user = this.users[index];

        this.http.delete("/api/users/" + user.id).subscribe(result => {
            if(result.status == 200) {
                this.toaster.pop('success', 'Success', 'User was deleted successfully.');
                this.users.splice(index, 1);
            } else {
                this.toaster.pop('error', 'Error', 'There was an error during deleting user.');
            }
        });
    }

}
