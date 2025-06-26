import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenService } from '../core/services/authen.service';

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


@Component({
   selector: 'app-refreshtoken',
   templateUrl: './RefreshToken.component.html',
   styleUrls: ['./refreshtoken.component.css']
})
export class RefreshTokenComponent implements OnInit, OnDestroy {

   constructor(private authenService: AuthenService,
      private route: ActivatedRoute,
      private router: Router) {
   }

   ngOnInit() {
         this.authenService.finishLogin()
      .then(_ => {
         this.router.navigate(['/login']);
      })

      
   }

   ngOnDestroy(): void {
   }
}
