import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SystemConstants } from './core/common/system.constants';
import { AuthenService } from './core/services/authen.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  public userAuthenticated = false;
  constructor(private _authService: AuthenService){
    localStorage.removeItem(SystemConstants.BRANCH_USESSO);
    localStorage.setItem('BRANCH_USESSO', window.location.hostname);

    if(window.location.href.includes('?code='))
      localStorage.removeItem(SystemConstants.LINKREDIRECT);

    if (window.location.href.includes('accesskey')) 
      localStorage.removeItem(SystemConstants.LINKREDIRECT);
      
    localStorage.setItem('LINKREDIRECT', window.location.href);

    this._authService.loginChanged
    .subscribe(userAuthenticated => {
      this.userAuthenticated = userAuthenticated;
    })

  }

  ngOnInit(): void {
    this._authService.isAuthenticated()
    .then(userAuthenticated => {
      this.userAuthenticated = userAuthenticated;
    })
  }

  // constructor() {
  //   localStorage.removeItem(SystemConstants.BRANCH_USESSO);
  //   localStorage.setItem('BRANCH_USESSO', window.location.hostname);

  //   if(window.location.href.includes('?code='))
  //     localStorage.removeItem(SystemConstants.LINKREDIRECT);

  //   if (window.location.href.includes('accesskey')) 
  //     localStorage.removeItem(SystemConstants.LINKREDIRECT);
      
  //   localStorage.setItem('LINKREDIRECT', window.location.href);
  // }
}
