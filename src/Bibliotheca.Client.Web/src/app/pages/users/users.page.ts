import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service';
import { GatewayClientService } from '../../services/gateway-client.service';
import { ToasterService } from 'angular2-toaster';
import { User } from '../../entities/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html'
})
export class UsersPage implements OnInit {

  protected users: User[];

  constructor(private header: HeaderService, private gatewayClient: GatewayClientService, private toaster: ToasterService) { 
      header.title = "Users";

      this.gatewayClient.getUsers().subscribe(result => {
          this.users = result.json();
      });
  }

    ngOnInit() {
        window.scrollTo(0,0);
    }

    protected tryDeleteUser(user: User) {
        user["deletionMode"] = true;
    }

    protected cancelDeleteUser(user: User) {
        user["deletionMode"] = false;
    }

    protected confirmDeleteUser(index: number) {
        var user = this.users[index];

        this.gatewayClient.deleteUser(user.id).subscribe(result => {
            if(result.status == 200) {
                this.toaster.pop('success', 'Success', 'User was deleted successfully.');
                this.users.splice(index, 1);
            } else {
                this.toaster.pop('error', 'Error', 'There was an error during deleting user.');
            }
        });
    }

}
