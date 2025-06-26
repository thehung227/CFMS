import { Injectable, ViewContainerRef, ReflectiveInjector, ComponentFactoryResolver, ComponentRef, Inject } from '@angular/core';

import { Http, Response, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

import { BravoCtorEnum } from './../core/enum/type.enum';

import { CryptoExtension } from './../core/extensions/crypto.extension';
import { AuthenService } from './../core/services/authen.service';
import { Global } from '../shared/global';
import { SystemConstants } from '../core/common/system.constants';
import { DataSetContract } from '../contracts/dataset.contract';
import { LoggedInUser } from '../core/domain/loggedin.user';
import { BaseService } from './base.service';



@Injectable()
export class BaseWidgetService extends BaseService {
   
}