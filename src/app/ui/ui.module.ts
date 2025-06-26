import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { DynamicFormInputComponent } from './form/dynamic-form-input.component';
import { DynamicFormPanelComponent } from './form/dynamic-form-panel.component';
import { DynamicFormEditorInputComponent } from './form/editor/dynamic-form-editor-input.component';
import { DynamicFormModalComponent  } from './form/dynamic-form-modal.component';
import { BaseService } from '../base/base.service';
import { DialogComponent } from './dialog/dialog.component';
import { BRGrid } from './grid/br-grid';
import { MailForm } from './mail-form/mail-form';

@NgModule({
    imports: [
        CommonModule,
        FormsModule, ReactiveFormsModule,
        WjGridModule,
        WjInputModule,
    ],
    providers: [BaseService],
    declarations: [DynamicFormInputComponent, DynamicFormPanelComponent, DynamicFormEditorInputComponent,DynamicFormModalComponent, DialogComponent,BRGrid, MailForm],
    exports: [DynamicFormInputComponent, DynamicFormPanelComponent, DynamicFormEditorInputComponent,DynamicFormModalComponent, DialogComponent,BRGrid, MailForm]
})

export class UIModule { }
