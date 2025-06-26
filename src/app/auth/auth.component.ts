import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenService } from '../core/services/authen.service';

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


@Component({
   selector: 'app-auth',
   templateUrl: './auth.component.html',
   styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {

   public textError: string;

   constructor(private authenService: AuthenService,
      private route: ActivatedRoute,
      private router: Router) {
   }

   ngOnInit() {
         this.authenService.finishLogin()
      .then(_ => {
         this.router.navigate(['/login']);
      }).catch((_err)=>{
         this.textError = _err.toString();

               
         if(_err.toString().toLowerCase().includes('no matching state found in storage')) {
            // clearing state and storage 
            // may not be necessary, 
            // but it seems reasonable
            this.authenService._userManager.clearStaleState();
            localStorage.clear();
            window.location.href = window.location.origin;
            // this.router.navigate(['/main', 'notifications', 'index']);
         }
         
      })



   }

   ngOnDestroy(): void {
   }
}
